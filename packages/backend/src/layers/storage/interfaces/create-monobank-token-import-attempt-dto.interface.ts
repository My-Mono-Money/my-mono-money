import { ICreateMonobankTokenDto } from './create-monobank-token-dto.interface';

export enum ImportAttemptStatusType {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Failed = 'failed',
  Staled = 'staled',
  Successful = 'successful',
}

export enum ImportAttemptLogDescription {
  StatementImportIsQueued = ' statement import is queued ',
  StartStatementImportExecution = ' start of statement import execution ',
  BlackCardExtractRequestFor = ' black card extract request for ',
  Successfully = ' successfully ',
  Failed = ' failed ',
}

export interface ICreateMonobankTokenImportAttemptDto {
  token: ICreateMonobankTokenDto;
  status: ImportAttemptStatusType;
  fetchedMonths: number;
  totalMonths: number;
  log: string;
}
