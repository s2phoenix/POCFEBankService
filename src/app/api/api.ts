export * from './authController.service';
import { AuthControllerService } from './authController.service';
export * from './transactionController.service';
import { TransactionControllerService } from './transactionController.service';
export * from './userInfoController.service';
import { UserInfoControllerService } from './userInfoController.service';
export const APIS = [AuthControllerService, TransactionControllerService, UserInfoControllerService];
