import { CategoryModel } from "../../categories/models/category.model";
import { WalletModel } from "../../wallets/models/wallet.model";

export interface TransacionItemResponse {
    id: number;
    amount: number;
    note: string;
    date: Date;
    category: CategoryModel;
    wallet: WalletModel;
}
