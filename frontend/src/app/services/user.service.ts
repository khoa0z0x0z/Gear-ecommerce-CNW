import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
}

export interface UserProfileUpdate {
  fullName: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7057/api/users';

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  updateProfile(profile: UserProfileUpdate): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, profile);
  }
}
