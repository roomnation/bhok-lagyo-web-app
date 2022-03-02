import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  requestModel = new FormGroup({
    'name': new FormControl(''),
    'number': new FormControl('')
  })
  error?: string;
  msg?: string;
  submittingForm?: boolean = false;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.msg = this.authService.msg;
  }


  onSubmit() {
    if (!this.submittingForm) {
      const authRequest = {
        name: this.requestModel.value.name,
        number: +this.requestModel.value.number
      }
      if (this.requestModel.valid) {
        this.submittingForm = true;
        this.authService
          .login(authRequest)
          .subscribe({
            next: (v) => {
              this.router.navigate(['/home'])
            },
            error: (e) => this.error = e,
            complete: () => {
              this.submittingForm = false;
            }
          });
      }
    }
  }

  clearMsg() {
    this.msg = undefined;
    this.error = undefined;
    this.authService.clearMsg();
    this.authService.clearErrMsg();
  }
}
