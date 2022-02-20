import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
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
  token?: number;
  employeesSubscription?: Subscription;
  error?: string;
  employeesLoading?: boolean = true;
  faIcon = faCoffee;
  canAttendSubscription?: Subscription;
  filteredEmployees?: AuthResponse[] = [];

  displayedColumns: string[] = ['name', 'number'];

  constructor(private employeeService: EmployeeService,
    private router: Router) { }

  ngOnDestroy(): void {
    this.employeesSubscription?.unsubscribe();
    this.canAttendSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.user = this.employeeService.getCurrentUser();
    this.canAttendSubscription = this.employeeService.getTimestamp$()
      .subscribe((v) => {
        if (new Date(v).getHours() < 11) {
          this.router.navigate(['/attend']);
        }
      });
    this.employeesSubscription = this.employeeService.getAllEmployees$()
      .subscribe(
        {
          next: (res) => {
            if (res != undefined) {
              this.employees = [];
              for (let i = 0; i < res.length; i++) {
                const employee = res[i];
                if (employee.id == this.user?.id) {
                  this.token = i + 1;
                }
                this.employees.push({ position: i + 1, ...employee })
              }
              this.filteredEmployees = this.employees;
              this.employeesLoading = false;
            }
          },
          error: (err) => this.error = err
        });
  }

  onSearch(event: any) {
    this.filteredEmployees = this.employees?.filter(employee => employee.name?.toLowerCase().includes(event.target.value.toLowerCase()));
  }
}
