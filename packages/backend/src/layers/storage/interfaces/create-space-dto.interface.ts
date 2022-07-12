import { ICreateUserDto } from './create-user-dto.interface';

export interface ICreateSpaceDto {
  owner: ICreateUserDto;
}
