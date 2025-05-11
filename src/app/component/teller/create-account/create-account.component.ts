import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoControllerService } from 'api/userInfoController.service';
import { CustomerRegisterRequestModel } from 'model/customerRegisterRequestModel';

@Component({
  selector: 'app-teller-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateAccountComponent {
  createAccountForm: FormGroup;
  loading = false;
  success = false;
  error = false;

  constructor(private fb: FormBuilder, private router: Router, private userInfoControllerService: UserInfoControllerService) {
    this.createAccountForm = this.fb.group({
      userID: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]], // Alphanumeric
      nameTH: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z\u0E00-\u0E7F ]*$')]], // Thai letters only
      nameEN: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]], // English letters only
    });
  }

  onSubmit() {
    if (this.createAccountForm.invalid) {
      return;
    }

    const formValue = this.createAccountForm.value;
    this.loading = true;
    this.success = false;
    this.error = false;
    const requestModel: CustomerRegisterRequestModel = {
      userId: formValue.userID,
      nameTH: formValue.nameTH,
      nameEN: formValue.nameEN,
    };

    const simulateWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    this.userInfoControllerService.customerRegister({ customerRegisterRequestModel: requestModel }).subscribe({
      next: async (response) => {
        await simulateWait(2000); // Simulate wait time (optional)
        console.log('Form Submitted:', requestModel);
        console.log('Success:', response);
        this.success = true;
        this.error = false;
        this.createAccountForm.reset();  // Reset form on success
        this.loading = false;
      },
      error: async (error) => {
        await simulateWait(2000); // Simulate wait time (optional)
        console.error('Error:', error);
        this.success = false;
        this.error = true;
        this.loading = false;
      }
    });
  }

  goBack() {
    this.createAccountForm.reset();
    this.router.navigate(['/']);
  }
}
