import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoControllerService } from 'api/userInfoController.service';
import { UserDetailService } from '../../service/userdetailservice';
import { AuthenticationService } from '../../service/authservice';
import { UserDetailResponse } from 'model/userDetailResponse';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../../interceptors/auth.interceptor';
import { LoginRequest } from 'model/loginRequest';
import { AuthControllerService } from 'api/authController.service'
import { AuthResponse } from 'model/authResponse'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = false;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private userInfoService: UserInfoControllerService, private userDetailService: UserDetailService, private authenticationService: AuthenticationService, private authService: AuthControllerService) {
    this.loginForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = false;
    const simulateWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

     const loginRequest: LoginRequest = {
      username: this.loginForm.value.id,
      password: this.loginForm.value.password
    };

    this.authService.login({ loginRequest }).subscribe({
      next: async (response: AuthResponse) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          await simulateWait(2000);
          this.getUserDetails();
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = true;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/preregister']);  // Adjust the path as per your routing configuration
  }

  getUserDetails(): void {
    this.userInfoService.getUserDetails().subscribe({
      next: (data: UserDetailResponse) => {
        // Store user details in the service
        if(data.role === 'PERSON') {
          this.router.navigate(['/preregister']);
        } else if(data.role === 'CUSTOMER') {
          this.router.navigate(['/statement']);
        } else if(data.role === 'TELLER') {
          this.router.navigate(['/teller-create-account']);
        } else {
          this.router.navigate(['/']);
        }
        this.userDetailService.setUserDetails(data);
      },
      error: (err) => {
        console.error('Error fetching user details', err);
      }
    });
  }
}
