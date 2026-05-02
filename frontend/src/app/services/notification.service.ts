import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  getById(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`);
  }

  create(notification: any) {
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  update(id: number, notification: any) {
    return this.http.put<Notification>(`${this.apiUrl}/${id}`, notification);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Get active notifications for a user (public endpoint)
  getActive(userId?: number) {
    const q = userId ? `?userId=${userId}` : '';
    return this.http.get<Notification[]>(`${this.apiUrl}/active${q}`);
  }
}
