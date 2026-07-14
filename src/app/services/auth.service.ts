import { Injectable } from '@angular/core';

export interface AuthUser {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  nationality: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly usersStorageKey = 'auth-users';
  private readonly tokenStorageKey = 'auth-token';
  private readonly currentUserStorageKey = 'auth-current-user';

  register(user: AuthUser): AuthResult {
    const users = this.getUsers();
    const normalizedEmail = user.email.trim().toLowerCase();

    if (users.some((existingUser) => existingUser.email.toLowerCase() === normalizedEmail)) {
      return {
        success: false,
        message: 'An account with this email already exists.',
      };
    }

    const newUser: AuthUser = {
      ...user,
      email: normalizedEmail,
    };

    users.push(newUser);
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));

    return {
      success: true,
      message: 'Registration successful. Please sign in.',
    };
  }

  login(email: string, password: string): AuthResult {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((existingUser) => existingUser.email.toLowerCase() === normalizedEmail);

    if (!user || user.password !== password) {
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    const token = this.generateJwtToken(user);
    localStorage.setItem(this.tokenStorageKey, token);
    localStorage.setItem(this.currentUserStorageKey, JSON.stringify(user));

    return {
      success: true,
      message: 'Login successful.',
    };
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.currentUserStorageKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  getCurrentUser(): AuthUser | null {
    const storedUser = localStorage.getItem(this.currentUserStorageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValid(token);
  }

  private getUsers(): AuthUser[] {
    const storedUsers = localStorage.getItem(this.usersStorageKey);
    return storedUsers ? JSON.parse(storedUsers) : [];
  }

  private generateJwtToken(user: AuthUser): string {
    const header = this.encode({ alg: 'HS256', typ: 'JWT' });
    const payload = this.encode({
      sub: user.email,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      exp: Date.now() + 60 * 60 * 1000,
    });
    const signature = this.encode(`${header}.${payload}.${user.password}`);
    return `${header}.${payload}.${signature}`;
  }

  private isTokenValid(token: string): boolean {
    const payload = this.decodeToken(token);

    if (!payload) {
      return false;
    }

    return !payload.exp || payload.exp > Date.now();
  }

  private decodeToken(token: string): { exp?: number } | null {
    const parts = token.split('.');

    if (parts.length !== 3) {
      return null;
    }

    try {
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
    }
  }

  private encode(value: unknown): string {
    return btoa(JSON.stringify(value));
  }
}
