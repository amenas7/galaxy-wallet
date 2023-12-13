import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AppSessionService } from '../../../../auth/services/session.service';

import { TransactionDTO } from '../interfaces/transaction.dto';
import { TransactionModel } from '../models/transaction.model';
import { TransacionItemResponse } from '../interfaces/transaction-item.response';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TransactionHttp {
  private http = inject(HttpClient);
  private session = inject(AppSessionService);
  private toastr = inject(ToastrService);
  private endpoint = 'transaction';

  getAllCount(): Observable<any> {
    let headers = new HttpHeaders({
       Authorization: `Bearer ${this.session.accessToken?.jwt}`,
    });

    const params = new HttpParams()

    return this.http.get<TransacionItemResponse[]>(this.endpoint, { params })
      .pipe(
        map((res) => res.map(item => new TransactionModel(item)))
      )
  }

  getAll(pageSize: number, page: number): Observable<any[]> {
    let headers = new HttpHeaders({
       Authorization: `Bearer ${this.session.accessToken?.jwt}`,
    });

    const params = new HttpParams({
      fromObject: {
        pageSize,
        page
      }
    })

    return this.http.get<any[]>(this.endpoint, { params })
      .pipe(
        map((res) => res.map(item => new TransactionModel(item)))
      )
  }

 getOne(id: number): Observable<TransactionModel> {
    return this.http.get<TransacionItemResponse>(`${this.endpoint}/${id}`)
      .pipe(
        map((res) => new TransactionModel(res))
      )
  }

  create(body: any) {
    return this.http.post(this.endpoint, body).pipe(
      catchError(error => {
        return this.handleHttpError(error);
      })
    );
  }

  update(id: number, body: any) {
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
