import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../auth/auth-response';
import { AuthService } from '../auth/auth.service';
import { EmployeeResponse } from './employee-response';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private timestamp$?: BehaviorSubject<number>;

  getTimestamp$(): BehaviorSubject<number> {
    return this.timestamp$!;
  }

  attend(): Observable<boolean> {
    return this.httpClient
      .post<boolean>(`${environment.baseURL}/present/employee`, this.authService.currentUser)
      .pipe(
        catchError((err) => {
          if (err.statusText.toLowerCase() === 'ok') {
            return throwError(() => err.error);
          } else {
            console.log(err);
            return throwError(() => 'Something went wrong. Please try again later.');
          }
        })
      );
  }

  getAllEmployees$(): Observable<AuthResponse[] | undefined> {
    const date = this.timestamp$?.value ?
      new Date(this.timestamp$?.value) :
      new Date();

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return this.httpClient
      .get<EmployeeResponse>(`${environment.baseURL}/present/employee/${date.getTime()}`)
      .pipe(
        map((v) => {
          return v.values ?? [];
        }),
      )
  }

  getCurrentUser(): AuthResponse | undefined {
    return this.authService.currentUser;
  }

  constructor(private authService: AuthService,
    private httpClient: HttpClient) {
    this.initializeTimestamp$();
  }

  private initializeTimestamp$() {
    const currentLocalTime = new Date();
    this.initializeToLocalTime(currentLocalTime);
    this.httpClient.get<number>(`${environment.baseURL}/timestamp`)
      .subscribe({
        next: (v) => {
          this.handleServerTimestamp(v);
        },
        error: () => {
          this.handleServerError();
        }
      });
  }

  private handleServerError() {
    const nextEligibleTime = this.get11am(new Date());
    if (!this.timestamp$?.getValue()) {
      setTimeout(() => {
        const d = this.get11am(new Date());
        this.timestamp$?.next(d.getTime());
      }, nextEligibleTime.getTime() - new Date().getTime());
    }
  }

  private handleServerTimestamp(v: number) {
    const serverTime = new Date(v);
    this.timestamp$?.next(serverTime.getTime());
    if (serverTime.getHours() < 11) {
      const nextEligibleTime = this.get11am(new Date());
      setTimeout(() => {
        this.timestamp$?.next(nextEligibleTime.getTime());
      }, nextEligibleTime.getTime() - serverTime.getTime());
    }
  }

  private get11am(date: Date): Date {
    const copy = new Date(date.getTime());
    copy.setHours(11);
    copy.setMinutes(0);
    copy.setSeconds(0);
    copy.setMilliseconds(0);
    return copy;
  }

  private initializeToLocalTime(currentLocalTime: Date) {
    this.timestamp$ = new BehaviorSubject(currentLocalTime.getTime());
  }
}
