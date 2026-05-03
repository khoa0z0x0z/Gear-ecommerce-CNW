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
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('userId', res.user.id);
        if (res.user.avatarUrl) localStorage.setItem('avatarUrl', res.user.avatarUrl);
        localStorage.setItem('isLoggedIn', 'true');
        this.isLoggedIn.set(true);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn.set(false);
  }
}
