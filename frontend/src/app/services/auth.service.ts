import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signal to track login status
  isLoggedIn = signal<boolean>(localStorage.getItem('isLoggedIn') === 'true');

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        if (res.refreshToken) {
          localStorage.setItem('refreshToken', res.refreshToken);
        }
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('userId', res.user.id);
        localStorage.setItem('isLoggedIn', 'true');
        this.isLoggedIn.set(true);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  logout(redirectTo: string = '/login') {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      // Call backend to hard delete the token
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({
        next: () => this.clearLocalState(redirectTo),
        error: () => this.clearLocalState(redirectTo) // Clear frontend state even if backend fails
      });
    } else {
      this.clearLocalState(redirectTo);
    }
  }

  private clearLocalState(redirectTo: string) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.isLoggedIn.set(false);
    // Hard redirect so Header re-mounts and signal re-reads
    window.location.href = redirectTo;
  }
}
