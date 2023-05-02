import { ICreateSpaceDto } from './create-space-dto.interface';

export enum StatusType {
  NEW = 'new',
  ACCEPTED = 'accept',
  REJECTED = 'reject',
}

export interface ICreateSpaceMemberInvitationDto {
  email: string;
  space: ICreateSpaceDto;
  status: StatusType;
}
