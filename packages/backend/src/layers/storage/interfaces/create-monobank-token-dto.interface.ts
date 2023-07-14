import { ICreateSpaceDto } from './create-space-dto.interface';

export interface ICreateMonobankTokenDto {
  space: ICreateSpaceDto;
  token: string;
}

export enum LastWebhookValidationStatusType {
  Active = 'active',
  Error = 'error',
}
