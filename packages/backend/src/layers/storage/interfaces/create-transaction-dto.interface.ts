export interface ICreateTransactionDto {
  account: {
    id: string;
  };
  time: number;
  description: string;
  mcc: number;
  originalMcc: number;
  hold: boolean;
  amount: number;
  operationAmount: number;
  currencyCode: number;
  commissionRate: number;
  cashbackAmount: number;
  balance: number;
  comment?: string;
  receiptId?: string;
  invoiceId?: string;
  counterEdrpou?: string;
  counterIban?: string;
}

export interface ITransactionErrorDto {
  status: string;
  statusText: string;
  data: string;
}
