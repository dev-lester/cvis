import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly HARDCODED_USERNAME = 'admin';
  private readonly HARDCODED_PASSWORD = 'password123';

  constructor(private router: Router) {}

  public login(username: string, password: string): boolean {
    if (
      username === this.HARDCODED_USERNAME &&
      password === this.HARDCODED_PASSWORD
    ) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', username);
      return true;
    }

    return false;
  }

  public logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  public getCurrentUser(): string | null {
    return localStorage.getItem('currentUser');
  }
}
