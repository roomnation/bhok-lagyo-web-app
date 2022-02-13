import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthRequest } from './auth-request';
import { AuthResponse } from './auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user?: AuthResponse;
  err?: string;

  constructor(private http: HttpClient) {

  }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.baseURL}/login`, authRequest)
      .pipe(
        tap(authRes => this.handleSuccessResponse(authRes)),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err.error);
        })
      );
  }

  logout(): void {
    this.user = undefined;
    this.err = undefined;
    localStorage.removeItem('user');
  }

  private handleSuccessResponse(authResponse: AuthResponse) {
    localStorage.setItem('user', JSON.stringify(authResponse));
    this.user = authResponse;
  }

  autologin(): void {
    try {
      const json = localStorage.getItem('user');
      if (json) {
        const user: AuthResponse = JSON.parse(json);
        if (!user) {
          return;
        }
        this.user = user;
        this.err = undefined;
      }
    } catch (e) {
      this.err = 'Got error while getting user from session';
      console.log(e);
    }
  }
}
