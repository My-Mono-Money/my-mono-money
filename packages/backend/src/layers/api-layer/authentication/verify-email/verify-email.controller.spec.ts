import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { createTestModuleForController } from 'src/test-utils/create-test-module-for-controller';
import { EntityManager } from 'typeorm';
import { VerifyEmailController } from './verify-email.controller';

describe('Verify email controller', () => {
  let verifyEmailController: VerifyEmailController;
  let mockedManager: DeepMocked<EntityManager>;
  let mockedRequest: DeepMocked<IRequestWithUser>;

  beforeEach(async () => {
    const testBootstrapResult = await createTestModuleForController([
      VerifyEmailController,
    ]);
    const moduleRef = testBootstrapResult.module;
    mockedManager = testBootstrapResult.mocks.mockedManager;
    mockedRequest = createMock<IRequestWithUser>();

    verifyEmailController = moduleRef.get(VerifyEmailController);
  });

  const setUserNotExists = () => {
    mockedManager.findOne.mockReturnValueOnce(Promise.resolve(null));
  };

  it('Verify email user successfully', async () => {
    expect.assertions(2);

    mockedRequest.user = {
      firstName: 'Jhonny',
      lastName: 'Depp',
      email: 'ao.salenko+johnny.depp@gmail.com',
    };
    const result = await verifyEmailController.verifyEmail(mockedRequest);

    expect(result.isSuccessful).toBe(true);
    expect(result.accessToken).toBeTruthy();
  });

  it('User not found', async () => {
    expect.assertions(1);

    setUserNotExists();

    try {
      await verifyEmailController.verifyEmail(mockedRequest);
    } catch (e) {
      expect(e).toEqual(new NotFoundError());
    }
  });
});
