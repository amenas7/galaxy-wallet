import { CategoryModel } from '../../categories/models/category.model';
import { WalletModel } from '../../wallets/models/wallet.model';
import { TransacionItemResponse } from '../interfaces/transaction-item.response';

export class TransactionModel {
  id: number;
  amount: number;
  note: string;
  date: Date;
  category: CategoryModel;
  wallet: WalletModel;

 
  constructor(transactionItem: TransacionItemResponse) {
    this.id = transactionItem.id;
    this.amount = transactionItem.amount;
    this.note = transactionItem.note;
    this.date = transactionItem.date;
    this.category = transactionItem.category;
    this.wallet = transactionItem.wallet;
  }
}