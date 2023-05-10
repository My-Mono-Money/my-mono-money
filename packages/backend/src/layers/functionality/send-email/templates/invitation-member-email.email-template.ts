import { ICreateUserDto } from 'src/layers/storage/interfaces/create-user-dto.interface';

interface IInvitationMemberEmailTemplate {
  user?: ICreateUserDto;
  email: string;
  frontendUrl: string;
  spaceOwnerEmail;
}

export const invitationMemberEmailTemplate = ({
  user,
  email,
  frontendUrl,
  spaceOwnerEmail,
}: IInvitationMemberEmailTemplate) => {
  function encodeForUrl(email: string) {
    return encodeURIComponent(email.replace(/\+/g, '%2B'));
  }
  return {
    to: {
      email: email,
      name: user ? `${user?.firstName} ${user?.lastName}` : undefined,
    },
    subject: 'Invitation to a shared space',
    content: `Please, follow the <a href="${frontendUrl}/accept-invite?invitedEmail=${encodeForUrl(
      email,
    )}&spaceOwnerEmail=${encodeForUrl(
      spaceOwnerEmail,
    )}">link</a> to accept invite`,
  };
};
