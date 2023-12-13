import { Routes } from '@angular/router';
import { NotFoundComponent } from './core/views/not-found/not-found.component';
import { AuthHttp } from './modules/auth/http/auth.http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { isAuthenticatedGuard } from './modules/auth/guards/is-authenticated.guard';
import { APP_BASE_URL_CONFIG, baseUrlInterceptor, provideAppBaseUrlConfig } from './core/interceptors/base-url.interceptor';
import { tokenInterceptor } from './modules/auth/interceptors/token.interceptor';
import { environment } from '../environments/environment';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    // providers: [provideHttpClient(), AuthHttp],
    providers: [
      provideHttpClient(withInterceptors([baseUrlInterceptor()])),
      AuthHttp
    ],
    loadChildren: () => import('./modules/auth/auth.routes'),
  },
  {
    path: 'admin',
    canActivate: [isAuthenticatedGuard],
    providers: [
      provideHttpClient(
        withInterceptors([baseUrlInterceptor(), tokenInterceptor])
      ),
      AuthHttp
    ],
    loadChildren: () => import('./modules/admin/admin.routes'),
  },
  { path: '**', component: NotFoundComponent },
];