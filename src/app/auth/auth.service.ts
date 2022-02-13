import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthRequest } from './auth-request';
import { AuthResponse } from './auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser?: AuthResponse;
  err?: string;

  constructor(private http: HttpClient,
    private router: Router) {

  }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.baseURL}/login`, authRequest)
      .pipe(
        tap(authRes => this.handleSuccessResponse(authRes)),
        catchError((err: HttpErrorResponse) => {
          if(err.statusText==='ok'){
            return throwError(() => err.error);
          }else{
            console.log(err);
            return throwError(() => 'Something went wrong. Please try again later.');
          }
        })
      );
  }

  logout(): void {
    this.currentUser = undefined;
    this.err = undefined;
    localStorage.removeItem('user');
    this.router.navigate(['auth']);
  }

  register(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.baseURL}/employee`, authRequest)
      .pipe(
        tap(authRes => this.handleSuccessResponse(authRes)),
        catchError((err: HttpErrorResponse) => {
          if(err.statusText==='ok'){
            return throwError(() => err.error);
          }else{
            console.log(err);
            return throwError(() => 'Something went wrong. Please try again later.');
          }
        })
      );
  }

  private handleSuccessResponse(authResponse: AuthResponse) {
    localStorage.setItem('user', JSON.stringify(authResponse));
    this.currentUser = authResponse;
  }

  autologin(): void {
    try {
      const json = localStorage.getItem('user');
      if (json) {
        const user: AuthResponse = JSON.parse(json);
        if (!user) {
          return;
        }
        this.currentUser = user;
        this.err = undefined;
      }
    } catch (e) {
      this.err = 'Got error while getting user from session';
      console.log(e);
    }
  }
}
