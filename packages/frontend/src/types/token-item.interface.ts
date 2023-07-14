export enum ImportAttemptStatusType {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Failed = 'failed',
  Staled = 'staled',
  Successful = 'successful',
}

export enum LastWebhookValidationStatusType {
  Active = 'active',
  Error = 'error',
}

export interface IImportAttempt {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ImportAttemptStatusType;
}

export interface ITokenItem {
  id: string;
  token: string;
  monobankUserName: string;
  totalAccounts: number;
  lastSuccessfulWebhookValidationTime: Date;
  lastWebhookValidationStatus: LastWebhookValidationStatusType;
  createdAt: string;
  updatedAt: string;
  importAttempts: IImportAttempt[];
}

export interface IImportAttemptLog extends IImportAttempt {
  log: string;
  totalMonths: number;
  fetchedMonths: number;
}
