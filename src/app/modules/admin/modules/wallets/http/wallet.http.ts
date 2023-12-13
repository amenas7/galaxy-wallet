import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AppSessionService } from '../../../../auth/services/session.service';

import { WalletDTO } from '../interfaces/wallet.dto';
import { WalletModel } from '../models/wallet.model';
import { WalletItemResponse } from '../interfaces/wallet-item.response';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class WalletHttp {
  private http = inject(HttpClient);
  private session = inject(AppSessionService);
  private toastr = inject(ToastrService);
  private endpoint = 'wallet';

  getAll(): Observable<WalletModel[]> {

    let headers = new HttpHeaders({
       Authorization: `Bearer ${this.session.accessToken?.jwt}`,
    });

    return this.http.get<WalletItemResponse[]>(this.endpoint)
      .pipe(
        map((res) => res.map(item => new WalletModel(item)))
      )
  }

  gettotalAmount(): Observable<any> {
    return this.http.get<WalletItemResponse>(`${this.endpoint}/total`)
      .pipe(
        map((res) => new WalletModel(res))
      )
  }

  getOne(id: number): Observable<WalletModel> {
    return this.http.get<WalletItemResponse>(`${this.endpoint}/${id}`)
      .pipe(
        map((res) => new WalletModel(res))
      )
  }

  create(body: WalletDTO) {
    return this.http.post(this.endpoint, body).pipe(
      catchError(error => {
        return this.handleHttpError(error);
      })
    );
  }

  update(id: number, body: WalletDTO) {
    return this.http.put(`${this.endpoint}/${id}`, body).pipe(
      catchError(error => {
        return this.handleHttpError(error);
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.endpoint}/${id}`).pipe(
      catchError(error => {
        return this.handleHttpError(error);
      })
    );
  }

  public handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.status === 400) {
      errorMessage = `${error.error.message[0]}`;
    }else if(error){
      errorMessage = `${error.error.message}`;
    }

    this.toastr.error(`${errorMessage}`, 'Error');
    //console.error(errorMessage);

    return throwError(() => new Error(errorMessage))
  }
}
