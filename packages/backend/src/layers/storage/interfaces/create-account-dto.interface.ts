import { ICreateMonobankTokenDto } from './create-monobank-token-dto.interface';

export interface ICreateAccountDto {
  token: ICreateMonobankTokenDto;
  sendId: string;
  currencyCode: number;
  cashbackType: string;
  balance: number;
  creditLimit: number;
  maskedPan: string[];
  type: string;
  iban: string;
}
