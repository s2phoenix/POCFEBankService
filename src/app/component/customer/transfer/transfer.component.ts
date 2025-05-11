import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionControllerService, GetAccountsRequestParams, TransferRequestParams} from 'api/transactionController.service';
import { AccountBalance } from 'model/accountBalance';
import { TransferRequest } from 'model/transferRequest';
import { UserDetailService } from '../../service/userdetailservice';
import { Router } from '@angular/router';


@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class TransferComponent {

  constructor(private fb: FormBuilder,private router: Router, private transactionService: TransactionControllerService, private userDetailService: UserDetailService) {
    userDetailService.getUserDetails().subscribe((userInfo) => {
        this.userID = userInfo?.userId ?? null; 
        if(this.userID == undefined){
          this.router.navigate(['/']);
        }
    });
    this.form = this.fb.group({
      sourceAccount: [null, Validators.required],
      destinationAccount: [null, Validators.required],
      transferAmount: [null, [Validators.required, Validators.min(1)]],
      pin: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  userID: string | null = null; 
  form: FormGroup;
  accounts: AccountBalance[] = [];
  mockDestinationAccounts: AccountBalance[] = [];
  selectedSourceAccount: any | null = null;
  selectedDestinationAccount: any = null;
  isVerified: boolean = false;
  loading = false;
  success = false;
  error = false;

  ngOnInit(): void {
     this.loadAccount();
  }  
  

  onSourceAccountChange() {
    this.selectedSourceAccount = this.accounts.find(account => account.accountId === this.form.value.sourceAccount.accountId);
  }

  onDestinationAccountChange() {
    this.selectedDestinationAccount = this.mockDestinationAccounts.find(account => account.accountId === this.form.value.destinationAccount.accountId);
  }

  verifyAccount() {
    const areAccountsDifferent = this.selectedSourceAccount.accountId !== this.selectedDestinationAccount.accountId;
    const isAmountValid = this.form.value.transferAmount <= this.selectedSourceAccount.balance;
    const areAccountsSelected = this.selectedSourceAccount && this.selectedDestinationAccount;

    if (areAccountsDifferent && isAmountValid && areAccountsSelected) {
      this.isVerified = true;
      alert('Transfer details verified successfully!');
    } else {
      alert('Invalid transfer details.');
    }
  }

  onTransferSubmit(){
    if (this.userID) {
      this.loading = true;
      this.success = false;
      this.error = false;
      const transferRequest: TransferRequest = {
        userId: this.userID,
        amount: this.form.value.transferAmount,
        sourceAccount: this.form.value.sourceAccount.accountId,
        destinationAccount: this.form.value.destinationAccount.accountId,
        pin: this.form.value.pin
      };

      const requestModel: TransferRequestParams = {
        transferRequest: transferRequest
      }

      const simulateWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      this.transactionService.transfer(requestModel).subscribe({
        next: async (response) => {
          await simulateWait(3000);
          this.success = true;
          this.error = false;
          this.form.reset();
          this.loading = false;
          this.isVerified = false;
        },
        error: async (error) => {
          await simulateWait(3000); 
          this.success = false;
          this.error = true;
          this.loading = false;
        }
      });
    }
  }

  loadAccount(): void {
     if (this.userID) {
      const params: GetAccountsRequestParams = { userId: this.userID };
      this.transactionService.getAccounts(params).subscribe({
        next: (data: AccountBalance[]) => {
          data.forEach(account => {
            const newAccount = {
              accountId: account.accountId,
              accountName: account.accountName,
              balance: account.balance
            };
            this.accounts.push(newAccount);
            this.mockDestinationAccounts.push(newAccount);
          });
        },
        error: (error) => {
          console.error('Error fetching statement:', error);
          this.router.navigate(['/']);
        }
      });
    }
  }
}
