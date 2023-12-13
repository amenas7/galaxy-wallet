import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AppSessionService } from '../../../../auth/services/session.service';

import { CategoryDTO } from '../interfaces/category.dto';
import { CategoryModel } from '../models/category.model';
import { CategoryItemResponse } from '../interfaces/category-item.response';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CategoryHttp {
  private http = inject(HttpClient);
  private session = inject(AppSessionService);
  private toastr = inject(ToastrService);
  private endpoint = 'category';

  getAll(): Observable<CategoryModel[]> {
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

    return this.http.get<CategoryItemResponse[]>(this.endpoint)
      .pipe(
        map((res) => res.map(item => new CategoryModel(item)))
      )
  }

  getOne(id: number): Observable<CategoryModel> {
    return this.http.get<CategoryItemResponse>(`${this.endpoint}/${id}`)
      .pipe(
        map((res) => new CategoryModel(res))
      )
  }

  create(body: CategoryDTO) {
    return this.http.post(this.endpoint, body).pipe(
      catchError(error => {
        return this.handleHttpError(error);
      })
    );
  }

  update(id: number, body: CategoryDTO) {
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
