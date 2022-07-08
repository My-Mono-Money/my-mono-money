import { ICreateSpaceDto } from './create-spase-dto.interface';

export interface ICreateMonobankTokenDto {
  spaceId: ICreateSpaceDto;
  token: string;
}
