import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  provideSessionConfig
} from './modules/auth/services/session.service';
import { provideHttpClient } from '@angular/common/http';
import { APP_BASE_URL_CONFIG, provideAppBaseUrlConfig } from './core/interceptors/base-url.interceptor';
import { environment } from '../environments/environment';
import { provideToastr } from 'ngx-toastr';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideAppBaseUrlConfig(environment.baseUrl),
    provideSessionConfig({
      redirectLoginPath: '/admin',
      redirectLogoutPath: '/auth',
    }),

  ],
};