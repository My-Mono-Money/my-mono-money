import { HashPasswordService } from './hash-password.service';

describe('HashService', () => {
  let hashService;
  let correctPassword;
  let wrongPassword;

  beforeEach(() => {
    hashService = new HashPasswordService();
    correctPassword = 'SomePassword123!';
    wrongPassword = 'SomeAnotherPassword123!';
  });

  it('Test correct password', async () => {
    const hash = await hashService.hashPassword({ password: correctPassword });

    const compareResult = await hashService.comparePassword({
      password: correctPassword,
      hash,
    });

    expect(compareResult).toBeTruthy();
  });

  it('Test incorrect password', async () => {
    const hash = await hashService.hashPassword({ password: correctPassword });

    const compareResult = await hashService.comparePassword({
      password: wrongPassword,
      hash,
    });

    expect(compareResult).toBeFalsy();
  });
});
