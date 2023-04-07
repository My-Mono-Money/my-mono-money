import { IUserSignUp } from '../../authentication/interfaces/user-signup-dto.interface';
import { IVerifyEmailTokenPayload } from '../../authentication/interfaces/verify-email-token-payload.interface';

interface IConfirmEmailTemplate {
  user: IUserSignUp | IVerifyEmailTokenPayload;
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
    content: `Please, follow the <a href="${frontendUrl}/confirm-email?code=${verifyEmailToken}">link</a> to confirm email`,
  };
};
