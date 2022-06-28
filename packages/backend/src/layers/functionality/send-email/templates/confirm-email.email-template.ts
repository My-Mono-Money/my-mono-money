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
  console.log('inTemplate', frontendUrl);
  return {
    to: {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    },
    subject: 'Confirm your email address',
    content: `Please, follow the <a href="${frontendUrl}/confirm-email?code=${verifyEmailToken}">link</a> to confirm email`,
  };
};
