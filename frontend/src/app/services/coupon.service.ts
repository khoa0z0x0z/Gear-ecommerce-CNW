import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Coupon } from '../models/coupon.model';

@Injectable({ providedIn: 'root' })
export class CouponService {
  private apiUrl = `${environment.apiUrl}/coupons`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.apiUrl);
  }

  getById(id: number): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiUrl}/${id}`);
  }

  create(coupon: any) {
    return this.http.post<Coupon>(this.apiUrl, coupon);
  }

  update(id: number, coupon: any) {
    return this.http.put<Coupon>(`${this.apiUrl}/${id}`, coupon);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Validate coupon for a given subtotal (public endpoint)
  validate(code: string, subtotal: number = 0) {
    return this.http.get<any>(`${this.apiUrl}/validate/${encodeURIComponent(code)}?subtotal=${subtotal}`);
  }
}
