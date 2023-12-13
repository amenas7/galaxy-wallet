import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SignInDto } from '../dto/sign-in.dto';
import { AppSessionService } from '../services/session.service';
import { Observable, map, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthHttp {
  private http = inject(HttpClient);
  private session = inject(AppSessionService);
  private toastr = inject(ToastrService);
  
  getToken(body: SignInDto) {
    return this.http.post('auth/sign-in', body).pipe(
      catchError(error => {
        return this.handleHttpError(error);
      })
    );
  }

  refreshToken() {
    const headers = {
      Authorization: `Bearer ${this.session.refreshToken?.jwt}`,
      skipToken: 'true',
      Custom: 'Hola Mundo',
    };

    return this.http.post('auth/refresh/token', {}, { headers });
  }

  SignUp(body: any) {
    return this.http.post('auth/sign-up', body).pipe(
      catchError(error => {
        return this.handleHttpError(error);
      })
    );
  }

  public handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.status === 400) {
      errorMessage = `${error.error.message}`;
    }else if(error){
      console.log("...", error);
      errorMessage = `${error.error.message}`;
    }

    this.toastr.error(`${errorMessage}`, 'Error');

    return throwError(() => new Error(errorMessage))
  }

}