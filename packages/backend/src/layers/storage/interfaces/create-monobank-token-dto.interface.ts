import { ICreateSpaceDto } from './create-spase-dto.interface';

export interface ICreateMonobankTokenDto {
  space: ICreateSpaceDto;
  token: string;
}
