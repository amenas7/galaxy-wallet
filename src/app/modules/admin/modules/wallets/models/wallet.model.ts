import { WalletItemResponse } from '../interfaces/wallet-item.response';

export class WalletModel {
  id: number;
  name: string;
  amount: number;
  userId: number;

  get fullname() {
    //return `${this.lastName}, ${this.firstName}`
    return '';
  }

  constructor(walletItem: WalletItemResponse) {
    this.id = walletItem.id;
    this.name = walletItem.name;
    this.amount = walletItem.amount;
    this.userId = walletItem.userId;
  }
}