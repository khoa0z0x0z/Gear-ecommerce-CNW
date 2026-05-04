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

  getProfile(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/details`);
  }

  updateProfile(updateData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, updateData);
  }
}
