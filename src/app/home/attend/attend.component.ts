import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthResponse } from 'src/app/auth/auth-response';
import { AuthService } from 'src/app/auth/auth.service';
import { EmployeeService } from 'src/app/employee/employee.service';

@Component({
  selector: 'app-attend',
  templateUrl: './attend.component.html',
  styleUrls: ['./attend.component.css']
})
export class AttendComponent implements OnInit, OnDestroy {
  currentUser?: AuthResponse;
  successMsg?: string;
  errorMsg?: string;
  canAttendSubscription?: Subscription;

  constructor(private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router) { }

  ngOnDestroy(): void {
    this.canAttendSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.canAttendSubscription = this.employeeService.getTimestamp$()
      .subscribe((v) => {
        if (new Date(v).getHours() >= 11) {
          this.router.navigate(['/home']);
        }
      })
  }

  onAttend() {
    this.employeeService.attend()
      .subscribe({
        next: (v) => this.successMsg = 'Attend successfully',
        error: (v) => {
          this.errorMsg = v;
        }
      });
  }

  clearErrorMsg() {
    this.errorMsg = undefined;
  }

  clearSuccessMsg() {
    this.successMsg = undefined;
  }
}
