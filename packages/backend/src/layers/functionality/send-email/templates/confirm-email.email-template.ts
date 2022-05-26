import { IUserSignUp } from '../../authentication/interfaces/user-signup-dto.interface';

interface IConfirmEmailTemplate {
  user: IUserSignUp;
}

export const confirmEmailTemplate = ({ user }: IConfirmEmailTemplate) => ({
  to: {
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
  },
  subject: 'Confirm your email address',
  content:
    'Please, follow the <a href="https://my-mono-money.app/">link</a> to confirm email',
});
