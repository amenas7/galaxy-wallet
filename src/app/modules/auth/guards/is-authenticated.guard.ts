import { inject } from '@angular/core';
import { Router, type CanActivateFn, type UrlTree } from '@angular/router';
import { AppSessionService } from '../services/session.service';

export const isAuthenticatedGuard: CanActivateFn = (
  route,
  state
): boolean | UrlTree => {
  const redirectUrl = route.routeConfig?.path;
  return (
    inject(AppSessionService).isAuthenticated() ||
    inject(Router).createUrlTree(['/auth'])
  );
};