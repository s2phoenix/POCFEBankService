// authentication.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() {}

  // Get the token (e.g., from localStorage or sessionStorage)
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Set the token (e.g., after a successful login)
  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  // Remove the token (e.g., on logout)
  removeToken(): void {
    localStorage.removeItem('accessToken');
  }
}
