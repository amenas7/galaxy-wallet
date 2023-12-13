/**
 * JWT Helper
 * https://www.npmjs.com/package/@auth0/angular-jwt
 */
import { JwtHelperService } from '@auth0/angular-jwt';

export class Token {
  private helper = new JwtHelperService();
  public isValid?: boolean;

  get isExpired() {
    return this.isValid ? this.helper.isTokenExpired(this.jwt) : true;
  }

  constructor(public jwt: string) {
    try {
      this.helper.decodeToken(this.jwt)
      this.isValid = true;
    } catch {
      this.isValid = false;
    }
  }

  getPayload<T>() {
    return this.helper.decodeToken(this.jwt) as T;
  }
}