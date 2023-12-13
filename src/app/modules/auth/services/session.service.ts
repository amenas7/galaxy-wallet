import {
  Injectable,
  InjectionToken,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { Token } from '../models/token.model';
import { StorageService } from '../../../core/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionUser } from '../models/user.model';
import { Payload } from '../interfaces/payload.interface';

export type AppSessionConfig = {
  redirectLoginPath: string;
  redirectLogoutPath: string;
};

export const APP_SESSION_CONFIG = new InjectionToken<AppSessionConfig>(
  'APP_SESSION_CONFIG',
  /** Opcional: Solo es para darle valores iniciales al InjectionToken */
  {
    providedIn: 'root',
    factory: () => ({
      redirectLoginPath: '',
      redirectLogoutPath: '',
    }),
  }
);

/** makeEnvironmentProviders: se usa para evitar la importación y uso de la función provedora dentro de un componente */
export const provideSessionConfig = (value: AppSessionConfig) =>
  makeEnvironmentProviders([
    {
      provide: APP_SESSION_CONFIG,
      useValue: value,
    },
  ]);

@Injectable({
  providedIn: 'root',
})

export class AppSessionService {
  private storage = inject(StorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private config: AppSessionConfig = inject(APP_SESSION_CONFIG);

  accessToken?: Token;
  refreshToken?: Token;

  public user?: SessionUser;

  constructor() {
    this.load();
  }

  getUser(): SessionUser | undefined {
    return this.isAuthenticated()
      ? new SessionUser(this.accessToken!.getPayload<any>())
      : undefined;
  }

  isAuthenticated(): boolean {
    return !!(
      this.accessToken?.isValid &&
      this.refreshToken &&
      this.refreshToken.isValid &&
      !this.refreshToken.isExpired
    );
  }

  private load() {
    this.accessToken = new Token(this.storage.get('accessToken'));
    this.refreshToken = new Token(this.storage.get('refreshToken'));
  }

  create(accessToken: string, refreshToken: string) {
    this.setTokens(accessToken, refreshToken);
    this.router.navigateByUrl(this.config.redirectLoginPath);
  }

  update(accessToken: string, refreshToken: string) {
    this.setTokens(accessToken, refreshToken);
  }

  destroy() {
    this.accessToken = undefined;
    this.refreshToken = undefined;

    this.storage.set('accessToken', this.accessToken);
    this.storage.set('refreshToken', this.refreshToken);

    this.user = undefined;

    this.router.navigateByUrl(this.config.redirectLogoutPath);
  }

  //
  private setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = new Token(accessToken);
    this.refreshToken = new Token(refreshToken);

    this.storage.set('accessToken', this.accessToken.jwt);
    this.storage.set('refreshToken', this.refreshToken.jwt);

    //this.user = new SessionUser(this.accessToken.getPayload<any>());
  }
}