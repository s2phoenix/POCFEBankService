import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDetailResponse } from '../../model/userDetailResponse';

@Injectable({
  providedIn: 'root',
})
export class UserDetailService {
  // BehaviorSubject to store and emit user details
  private userDetailSubject = new BehaviorSubject<UserDetailResponse | null>(null);

  constructor() {}

  // Method to get the current user details (Observable)
  getUserDetails(): Observable<UserDetailResponse | null> {
    return this.userDetailSubject.asObservable();
  }

  // Method to set the user details
  setUserDetails(userDetails: UserDetailResponse): void {
    this.userDetailSubject.next(userDetails);
  }
}