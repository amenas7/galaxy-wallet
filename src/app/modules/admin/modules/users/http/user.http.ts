import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AppSessionService } from '../../../../auth/services/session.service';

@Injectable()
export class UserHttp {
  private http = inject(HttpClient);
  private session = inject(AppSessionService);

  getAll() {
    // TODO: refactorizar url base con interceptor
    // TODO: Refactorizar con tipado

    //console.log("this.session", this.session);
    let headers = new HttpHeaders({
       Authorization: `Bearer ${this.session.accessToken?.jwt}`,
    });

    /*
     * Si se desea agregar un header siguiendo una condición usar la siguiente sintaxis
     */

    // if (true) {
    //   headers = headers.append('encode', 'uft8')
    // }

    return this.http.get<any[]>('wallet', { headers: headers });
  }
}
