import { InvalidEmailOrPasswordError } from 'src/common/errors/invalid-email-or-password.error';
import { createTestModuleForController } from 'src/test-utils/create-test-module-for-controller';
import { SignInController } from './sign-in.controller';

describe.skip('Sign In controller', () => {
  let signInController: SignInController;

  beforeEach(async () => {
    const testBootstrapResult = await createTestModuleForController([
      SignInController,
    ]);
    const moduleRef = testBootstrapResult.module;

    signInController = moduleRef.get(SignInController);
  });

  it('Sign in user successfully', async () => {
    const result = await signInController.signIn({
      email: 'dima@example.com',
      password: 'DimaExample2022!',
    });

    expect(result.accessToken).toBeTruthy();
  });

  it('Incorrect email or password', async () => {
    expect.assertions(1);

    try {
      await signInController.signIn({
        email: 'ao.salenko+johnny.depp@gmail.com',
        password: 'JhonnyLove2022!',
      });
    } catch (e) {
      expect(e).toEqual(new InvalidEmailOrPasswordError());
    }
  });
});
