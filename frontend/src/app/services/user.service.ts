import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}/details`);
  }

  // Not implemented in backend yet, but we can prepare it
  // updateProfile(userId: number, data: any): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/${userId}`, data);
  // }
}
