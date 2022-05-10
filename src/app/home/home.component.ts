import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { map, Subscription } from 'rxjs';
import { AuthResponse } from '../auth/auth-response';
import { BlacklistService } from '../blacklist.service';
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
  @ViewChild('tokenRef') tokenRef?: ElementRef;
  @ViewChild('dateRef') dateRef?: ElementRef;
  dateValue?: string;
  monitorTimeout?: any;

  displayedColumns: string[] = ['name', 'number'];

  constructor(private employeeService: EmployeeService,
    private router: Router,
    private blacklistService: BlacklistService) { }

  ngOnDestroy(): void {
    this.employeesSubscription?.unsubscribe();
    this.canAttendSubscription?.unsubscribe();
    if (this.monitorTimeout) clearTimeout(this.monitorTimeout);
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
    this.monitorInpection();
  }

  monitorInpection() {
    console.log('Monitoring inspection');
    this.monitorTimeout = setInterval(() => {
      const tokenRefValue = this.tokenRef?.nativeElement.textContent?.trim();
      const newDateValue = this.dateRef?.nativeElement.textContent?.trim();
      if ((tokenRefValue && tokenRefValue != this.token) ||
        (this.dateValue && this.dateValue != newDateValue)) {
        this.blacklistService.write({
          ...this.user,
          time: new Date()
        });
        this.router.navigate(['/rekt']);
      } else {
      }
      this.dateValue = newDateValue;
    }, 250);
  }

  getDate() {
    return this.employeeService.getTimestamp$()
      .pipe(map(v => new Date(v)));
  }

  onSearch(event: any) {
    this.filteredEmployees = this.employees?.filter(employee => employee.name?.toLowerCase().includes(event.target.value.toLowerCase()));
  }
}
