import { Routes } from '@angular/router';
import { ListComponent } from './views/list/list.component';

const routes: Routes = [
  { path: '', title: "Mis movimientos", component: ListComponent },
  { path: 'create', loadComponent: () => import('./views/create/create.component') },
  { path: ':id/update', loadComponent: () => import('./views/update/update.component') },
]

export default routes;