import { IUserSignUp } from '../../authentication/interfaces/user-signup-dto.interface';

interface IConfirmEmailTemplate {
  user: IUserSignUp;
  verifyEmailToken: string;
  frontendUrl: string;
}

export const confirmEmailTemplate = ({
  user,
  verifyEmailToken,
  frontendUrl,
}: IConfirmEmailTemplate) => {
  return {
    to: {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    },
    subject: 'Confirm your email address',
    // content: `Please, follow the <a href="${frontendUrl}/v1/confirm-email?code=${verifyEmailToken}">link</a> to confirm email`,
    content: `Please, follow the <a href="${process.env.BACKEND_URL}/v1/confirm-email?code=${verifyEmailToken}">link</a> to confirm email`,
  };
};
