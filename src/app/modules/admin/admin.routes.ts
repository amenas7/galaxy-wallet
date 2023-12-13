import { Routes } from '@angular/router';
import { UserHttp } from './modules/users/http/user.http';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { WalletHttp } from './modules/wallets/http/wallet.http';
import { CategoryHttp } from './modules/categories/http/category.http';
import { TransactionHttp } from './modules/transactions/http/transaction.http';

const routes: Routes = [
  { path: '', redirectTo: 'transactions', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      {
        path: 'wallets',
        providers: [WalletHttp],
        loadChildren: () => import('./modules/wallets/wallets.routes'),
      },
      {
        path: 'categories',
        providers: [CategoryHttp],
        loadChildren: () => import('./modules/categories/categories.routes'),
      },
      {
        path: 'transactions',
        providers: [TransactionHttp, WalletHttp, CategoryHttp],
        loadChildren: () => import('./modules/transactions/transactions.routes'),
      },
      {
        path: 'users',
        providers: [UserHttp],
        loadChildren: () => import('./modules/users/users.routes'),
      },
      
    ],
  },
];

export default routes;