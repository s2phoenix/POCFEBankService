import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionControllerService } from 'api/transactionController.service';
import { DepositRequestParams } from 'api/transactionController.service';

@Component({
  selector: 'app-teller-deposit',
  templateUrl: './teller-deposit.component.html',
  styleUrls: ['./teller-deposit.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class TellerDepositComponent {
  depositForm: FormGroup;
  loading = false;
  error = false;
  success = false;
  showConfirmation = false;

  constructor(private fb: FormBuilder, private router: Router,private transactionControllerService: TransactionControllerService) {
    // Initialize the form with validation
    this.depositForm = this.fb.group({
      accountID: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      money: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.depositForm.valid) {
      this.showConfirmation = true; // Show confirmation after the first submit
    }
  }

  // Finalize the deposit after confirmation
  finalizeDeposit() {
    this.loading = true;
    this.success = false;
    this.error = false;
    const formValue = this.depositForm.value;
    const requestModel: DepositRequestParams = {
      account: formValue.accountID,
      amount: formValue.money,
    };

    const simulateWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    this.transactionControllerService.deposit({ ...requestModel }).subscribe({
      next: async (response) => {
        await simulateWait(2000);
        
        console.log('Form Submitted:', requestModel);
        console.log('Success:', response);

        this.success = true;
        this.error = false;
        this.loading = false;
        this.showConfirmation = false;
        this.depositForm.reset(); 

        setTimeout(() => {
          this.success = false; 
        }, 3000);
      },
      error: async (error) => {
        await simulateWait(2000); 

        this.success = false;
        this.error = true;
        this.loading = false;
        this.showConfirmation = false;
      }
    });
  }

  // Cancel the deposit and reset the confirmation
  cancelDeposit() {
    this.showConfirmation = false;
  }

  // Back to the main menu
  goBack() {
    this.router.navigate(['/']);
  }
}
