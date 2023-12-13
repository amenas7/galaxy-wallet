export interface TransactionDTO {
    id?: number;
    amount: number;
    note: string;
    date?: Date;
    category?: any;
  }