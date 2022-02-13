import { Component, OnInit } from '@angular/core';
import { AuthResponse } from 'src/app/auth/auth-response';
import { AuthService } from 'src/app/auth/auth.service';
import { EmployeeService } from 'src/app/employee/employee.service';

@Component({
  selector: 'app-attend',
  templateUrl: './attend.component.html',
  styleUrls: ['./attend.component.css']
})
export class AttendComponent implements OnInit {
  currentUser?: AuthResponse;
  successMsg?: string;
  errorMsg?: string;

  constructor(private authService: AuthService,
    private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
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
