import { DeepMocked } from '@golevelup/ts-jest';
import { DuplicatedEntityError } from 'src/common/errors/duplicated-entity.error';
import { UnknownError } from 'src/common/errors/unknown.error';
import { SendinblueIntegration } from 'src/layers/integration/sendinblue/sendinblue.integration';
import { createTestModuleForController } from 'src/test-utils/create-test-module-for-controller';
import { databaseErrors } from 'src/test-utils/errors/database-errors';
import { EntityManager } from 'typeorm';
import { SignUpController } from './sign-up.controller';

describe('Sign Up controller', () => {
  let signUpController: SignUpController;
  let mockedManager: DeepMocked<EntityManager>;
  let mockedSendInBlueIntegration: DeepMocked<SendinblueIntegration>;

  beforeEach(async () => {
    const testBootstrapResult = await createTestModuleForController([
      SignUpController,
    ]);
    const moduleRef = testBootstrapResult.module;
    mockedManager = testBootstrapResult.mocks.mockedManager;
    mockedSendInBlueIntegration =
      testBootstrapResult.mocks.mockedSendInBlueIntegration;

    signUpController = moduleRef.get(SignUpController);
  });

  it('Sign up user successfully', async () => {
    const result = await signUpController.signUp({
      firstName: 'Jhonny',
      lastName: 'Depp',
      email: 'ao.salenko+johnny.depp@gmail.com',
      password: 'JhonnyLove2022!',
    });

    expect(result.isSuccessful).toBe(true);
    expect(
      mockedSendInBlueIntegration.sendTransactionalEmail,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        to: {
          email: 'ao.salenko+johnny.depp@gmail.com',
          name: 'Jhonny Depp',
        },
        subject: 'Confirm your email address',
      }),
    );
  });

  it('Email already existing', async () => {
    expect.assertions(2);

    mockedManager.save.mockRejectedValueOnce(
      databaseErrors.keyAlreadyExists('email'),
    );

    try {
      await signUpController.signUp({
        firstName: 'Jhonny',
        lastName: 'Depp',
        email: 'ao.salenko+johnny.depp@gmail.com',
        password: 'JhonnyLove2022!',
      });
    } catch (e) {
      expect(e).toEqual(new DuplicatedEntityError());
      expect(
        mockedSendInBlueIntegration.sendTransactionalEmail,
      ).not.toHaveBeenCalled();
    }
  });

  it('Unknown database error', async () => {
    expect.assertions(2);

    mockedManager.save.mockRejectedValueOnce(new Error(`Some another error`));

    try {
      await signUpController.signUp({
        firstName: 'Jhonny',
        lastName: 'Depp',
        email: 'ao.salenko+johnny.depp@gmail.com',
        password: 'JhonnyLove2022!',
      });
    } catch (e) {
      expect(e).toEqual(new UnknownError());
      expect(
        mockedSendInBlueIntegration.sendTransactionalEmail,
      ).not.toHaveBeenCalled();
    }
  });

  it("Email hasn't been sent", async () => {
    expect.assertions(1);

    mockedSendInBlueIntegration.sendTransactionalEmail.mockRejectedValueOnce(
      new Error('Some sendinblue error'),
    );

    try {
      await signUpController.signUp({
        firstName: 'Jhonny',
        lastName: 'Depp',
        email: 'ao.salenko+johnny.depp@gmail.com',
        password: 'JhonnyLove2022!',
      });
    } catch (e) {
      expect(e).toEqual(new UnknownError());
    }
  });
});
