import type { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  InjectionToken,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';

/* export const APP_BASE_URL_CONFIG = new InjectionToken<string>('APP_BASE_URL_CONFIG', {
  providedIn: 'root',
  factory: () => environment.baseUrl
}) */

export const APP_BASE_URL_CONFIG = new InjectionToken<string>(
  'APP_BASE_URL_CONFIG'
);

export const provideAppBaseUrlConfig = (baseUrl: string) =>
  makeEnvironmentProviders([
    {
      provide: APP_BASE_URL_CONFIG,
      useValue: baseUrl,
    },
  ]);

export const baseUrlInterceptor = (
  baseUrlParam?: string
): HttpInterceptorFn => {
  return (req, next) => {
    if (req.url.startsWith('http')) return next(req)

    const baseUrl = baseUrlParam ?? inject(APP_BASE_URL_CONFIG);

    const newReq = req.clone({
      url: `${baseUrl}/${req.url}`,
    });

    return next(newReq);
  };
};