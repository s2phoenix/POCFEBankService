import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoControllerService } from 'api/userInfoController.service';
import { RegisterRequestModel } from 'model/registerRequestModel';

@Component({
  selector: 'app-preregister',
  templateUrl: './preregister.component.html',
  styleUrls: ['./preregister.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PreregisterComponent implements OnInit {
  form: FormGroup;
  showPassword = false;
  loading = false;
  success = false;
  error = false;

  constructor(private fb: FormBuilder, private router: Router, private userInfoControllerService: UserInfoControllerService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      id: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]], // 13 digits only
      thaiName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z\u0E00-\u0E7F ]*$')]], // Thai name (no special chars)
      englishName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]], // English name (no special chars)
      pin: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]] // 6 digits PIN
    });
  }

  ngOnInit(): void {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.success = false;
    this.error = false;
    const formValue = this.form.value;
    const requestModel: RegisterRequestModel = {
      email: formValue.email,
      password: formValue.password,
      citizenId: formValue.id,
      nameTH: formValue.thaiName,
      nameEN: formValue.englishName,
      pin: formValue.pin
    };

    const simulateWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    this.userInfoControllerService.preRegister({ registerRequestModel: requestModel }).subscribe({
      next: async (response) => {
        await simulateWait(2000); // Simulate wait time (optional)
        console.log('Form Submitted:', requestModel);
        console.log('Success:', response);
        this.success = true;
        this.error = false;
        this.form.reset();  // Reset form on success
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

  goBack(): void {
    this.form.reset();
    this.router.navigate(['/']);
  }
}