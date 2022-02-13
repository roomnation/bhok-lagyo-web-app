import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthResponse } from '../auth/auth-response';
import { EmployeeService } from '../employee/employee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  user?: AuthResponse;
  employees?: AuthResponse[] = [];
  token?: number = 10;
  subscription?: Subscription;
  error?: string;
  employeesLoading?: boolean = true;
  canAttend$?: Observable<boolean>;

  displayedColumns: string[] = ['name', 'number'];

  constructor(private employeeService: EmployeeService) { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.user = this.employeeService.getCurrentUser();
    this.canAttend$ = this.employeeService.getCanAttend$();
    this.subscription = this.employeeService.getAllEmployees$()
      .subscribe(
        {
          next: (res) => {
            if (res) {
              this.employees = [];
              for (let i = 0; i < res.length; i++) {
                const employee = res[i];
                if (employee.id == this.user?.id) {
                  this.token = i + 1;
                }
                this.employees.push({ position: i + 1, ...employee })
                this.employeesLoading = false;
              }
            }
          },
          error: (err) => this.error = err
        });
  }

}
