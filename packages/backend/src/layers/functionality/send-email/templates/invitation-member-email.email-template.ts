import { ICreateUserDto } from 'src/layers/storage/interfaces/create-user-dto.interface';

interface IInvitationMemberEmailTemplate {
  user?: ICreateUserDto;
  email: string;
  frontendUrl: string;
}

export const invitationMemberEmailTemplate = ({
  user,
  email,
  frontendUrl,
}: IInvitationMemberEmailTemplate) => {
  return {
    to: {
      email: email,
      name: user ? `${user?.firstName} ${user?.lastName}` : undefined,
    },
    subject: 'Invitation to a shared space',
    content: `Please, follow the <a href="${frontendUrl}/accept-invite/${email}">link</a> to accept invite`,
  };
};
