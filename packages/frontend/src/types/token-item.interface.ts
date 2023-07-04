export enum ImportAttemptStatusType {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Failed = 'failed',
  Staled = 'staled',
  Successful = 'successful',
}

export interface IImportAttempt {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ImportAttemptStatusType;
  totalMonths: number;
}

export interface ITokenItem {
  token: string;
  monobankUserName: string;
  totalAccounts: number;
  createdAt: string;
  updatedAt: string;
  importAttempts: IImportAttempt[];
}
