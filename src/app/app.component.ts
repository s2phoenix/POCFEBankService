import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { UserDetailService } from './component/service/userdetailservice';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  userID: string | null = null; 
  userRole: string | null = null;

  constructor(private router: Router, private userDetailService: UserDetailService) {
    userDetailService.getUserDetails().subscribe((userInfo) => {
      this.userID = userInfo?.userId ?? null; 
      this.userRole = userInfo?.role ?? null; 
    });
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
  
  goToRegister() {
    this.router.navigate(['/preregister']);
  }

   goToCustomerRegister() {
    this.router.navigate(['/teller-create-account']);
  }

  goToTellerDeposit() {
    this.router.navigate(['/teller-deposit']);
  }

  goToTellerCreateAccount() {
    this.router.navigate(['/teller-create-account']);
  }

  goToCustomerStatement(){
    this.router.navigate(['/statement']);
  }

  goToCustomerTrnasfer(){
    this.router.navigate(['/transfer']);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken'); 
    this.router.navigate(['/']); 
  }
}
