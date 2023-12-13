import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  {
    path: 'sign-in',
    loadComponent: () => import('./views/sign-in/sign-in.component'),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./views/sign-up/sign-up.component'),
  },
];

export default routes;