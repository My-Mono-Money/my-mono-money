import { EntityManager } from 'typeorm';
import { DeepMocked } from '@golevelup/ts-jest';
import { UnauthorizedError } from 'src/common/errors/unauthorized.error';
import { createTestModuleForController } from 'src/test-utils/create-test-module-for-controller';
import { SignInController } from './sign-in.controller';
import { UnknownError } from 'src/common/errors/unknown.error';

describe('Sign In controller', () => {
  let signInController: SignInController;
  let mockedManager: DeepMocked<EntityManager>;

  beforeEach(async () => {
    const testBootstrapResult = await createTestModuleForController([
      SignInController,
    ]);
    const moduleRef = testBootstrapResult.module;
    mockedManager = testBootstrapResult.mocks.mockedManager;

    signInController = moduleRef.get(SignInController);
  });

  const setUserExists = () => {
    mockedManager.findOne.mockReturnValueOnce(
      Promise.resolve({
        email: 'dima@example.com',
        firstName: 'Dima',
        lastName: 'Dima',
        passwordHash:
          '$2b$10$T9BvpT3j.8BjtMfAiUTfcuMonnsn/QAwZiy9k/o14NOo4FvK1Jr8y',
        id: '397e277a-ee8b-416d-95ad-7b21bf9d6a9d',
      }),
    );
  };

  const setUserNotExists = () => {
    mockedManager.findOne.mockReturnValueOnce(Promise.resolve(null));
  };

  it('Sign in user successfully', async () => {
    expect.assertions(2);

    setUserExists();

    const result = await signInController.signIn({
      email: 'dima@example.com',
      password: 'DimaExample2022!',
    });

    expect(result.accessToken).toBeTruthy();
    expect(result.isSuccessful).toBe(true);
  });

  it('No user existing', async () => {
    expect.assertions(1);

    setUserNotExists();

    try {
      await signInController.signIn({
        email: 'ao.salenko+johnny.depp@gmail.com',
        password: 'JhonnyLove2022!',
      });
    } catch (e) {
      expect(e).toEqual(new UnauthorizedError());
    }
  });

  it('Wrong password', async () => {
    expect.assertions(1);

    setUserExists();

    try {
      await signInController.signIn({
        email: 'ao.salenko+johnny.depp@gmail.com',
        password: 'JhonnyLove2022',
      });
    } catch (e) {
      expect(e).toEqual(new UnauthorizedError());
    }
  });

  it('Unknown database error', async () => {
    expect.assertions(1);

    mockedManager.findOne.mockRejectedValueOnce(
      new Error('Some another error'),
    );

    try {
      await signInController.signIn({
        email: 'ao.salenko+johnny.depp@gmail.com',
        password: 'JhonnyLove2022!',
      });
    } catch (e) {
      expect(e).toEqual(new UnknownError());
    }
  });
});
