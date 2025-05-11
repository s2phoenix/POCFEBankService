import { Routes } from '@angular/router';
import { LoginComponent } from './component/auth/login/login.component';
import { PreregisterComponent } from './component/person/preregister/preregister.component';
import { CreateAccountComponent } from './component/teller/create-account/create-account.component';
import { TellerDepositComponent } from './component/teller/teller-deposit/teller-deposit.component';
import { StatementComponent } from './component/customer/statement/statement.component';
import { TransferComponent } from './component/customer/transfer/transfer.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'preregister', component: PreregisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'teller-create-account', component: CreateAccountComponent },
  { path: 'teller-deposit', component: TellerDepositComponent },
  { path: 'statement', component: StatementComponent },
  { path: 'transfer', component: TransferComponent },
];
