import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../auth/auth-response';
import { AuthService } from '../auth/auth.service';
import { EmployeeResponse } from './employee-response';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private canAttend$?: BehaviorSubject<boolean>;
  private employees$?: BehaviorSubject<AuthResponse[]>;

  getCanAttend$(): BehaviorSubject<boolean> {
    return this.canAttend$!;
  }

  attend(): Observable<boolean> {
    return this.httpClient
      .put<boolean>(`${environment.baseURL}/present/employee`, this.authService.currentUser)
      .pipe(
        catchError((err) => {
          if (err.statusText === 'ok') {
            return throwError(() => err.error);
          } else {
            console.log(err);
            return throwError(() => 'Something went wrong. Please try again later.');
          }
        })
      );
  }

  getAllEmployees$(): Observable<AuthResponse[] | undefined> {
    return this.employees$!;
  }

  getCurrentUser(): AuthResponse | undefined {
    return this.authService.currentUser;
  }

  constructor(private authService: AuthService,
    private httpClient: HttpClient) {
    this.initializeCanAttend$();
    this.initializeEmployees$();
  }

  initializeEmployees$() {
    const json = localStorage.getItem('employees');
    if (json) {
      const employees: AuthResponse[] = JSON.parse(json);
      this.employees$ = new BehaviorSubject<AuthResponse[]>(employees);
    } else {
      this.employees$ = new BehaviorSubject<AuthResponse[]>([]);
    }
    this.httpClient.get<EmployeeResponse>(`${environment.baseURL}/employee`)
      .subscribe({
        next: (v) => {
          this.employees$?.next(v.values ?? []);
          localStorage.setItem('employees', JSON.stringify(this.employees$?.getValue()));
        },
        error: (err) => this.employees$?.error(err)
      })
  }

  private initializeCanAttend$() {
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
    if (!this.canAttend$?.getValue()) {
      setTimeout(() => {
        this.canAttend$?.next(false);
      }, nextEligibleTime.getTime() - new Date().getTime());
    }
  }

  private handleServerTimestamp(v: number) {
    const currentTime = new Date(v);
    console.log('Server Timestamp : ', currentTime);
    if (currentTime.getHours() >= 11) {
      this.canAttend$?.next(false);
    } else {
      this.canAttend$?.next(true);
      const nextEligibleTime = this.get11am(new Date());
      setTimeout(() => {
        this.canAttend$?.next(false);
      }, nextEligibleTime.getTime() - currentTime.getTime());
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
    if (currentLocalTime.getHours() >= 11) {
      this.canAttend$ = new BehaviorSubject<boolean>(false);
    } else {
      this.canAttend$ = new BehaviorSubject<boolean>(true);
    }
  }
}
