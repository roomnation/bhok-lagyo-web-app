import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../auth/auth-response';
import { AuthService } from '../auth/auth.service';
import { EmployeeResponse } from './employee-response';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  getAllEmployees(): Observable<AuthResponse[] | undefined> {
    return of([
      {name:'Kshitij Dhakal', number: 9},
      {name:'Sanjit Shrestha', number: 9},
      {name:'Sujeet Rimal', number: 9},
      {name:'Pawan Gurung', number: 9},
      {name:'Ram Krishna Acharya', number: 9}
    ]);
    return this.httpClient
      .get<EmployeeResponse>(`${environment.baseURL}/employee`)
      .pipe(map(res => res.values));
  }

  getCurrentUser(): AuthResponse | undefined {
    return this.authService.user;
  }

  constructor(private authService: AuthService,
    private httpClient: HttpClient) { }
}
