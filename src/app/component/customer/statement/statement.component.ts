import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionControllerService, GetStatementRequestParams } from 'api/transactionController.service';
import { TransactionStatementResponse } from 'model/transactionStatementResponse';
import { UserDetailService } from '../../service/userdetailservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statement',
  imports: [CommonModule],
  templateUrl: './statement.component.html',
  styleUrl: './statement.component.scss'
})
export class StatementComponent {
  statements: any[] = [];
  userID: string | null = null; 

  constructor(private router: Router, private transactionService: TransactionControllerService, private userDetailService: UserDetailService) {
      userDetailService.getUserDetails().subscribe((userInfo) => {
        this.userID = userInfo?.userId ?? null; 
    });
  }

  ngOnInit(): void {
     this.loadStatement();
  }

  toggle(account: any): void {
    account.show = !account.show;
  }

  loadStatement(): void {
     if (this.userID) {
      const params: GetStatementRequestParams = { userId: this.userID };

      this.transactionService.getStatement(params).subscribe({
        next: (data: TransactionStatementResponse[]) => {
          // Process each account's transactions
          data.forEach(account => {
            const newStatement = {
              account: account.account, // Correct to access the current item of the array
              showing: false,
              transactions: account.transactions || [] // Ensure transactions is always an array
            };
            this.statements.push(newStatement);  // Add to the list of statements
          });
        },
        error: (error) => {
          console.error('Error fetching statement:', error);  // Handle error
        }
      });
    } else {
      console.error('User ID is not available');
      this.router.navigate(['/']);
    }
  }
  
  goBack(){

  }
}
