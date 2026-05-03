import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Review, ReviewUpsert } from '../models/review.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Reviews
  getReviews(productId: number) {
    return this.http.get<Review[]>(`${environment.apiUrl}/reviews/product/${productId}`);
  }

  addReview(dto: ReviewUpsert) {
    return this.http.post<Review>(`${environment.apiUrl}/reviews`, dto);
  }

  updateReview(id: number, dto: ReviewUpsert) {
    return this.http.put(`${environment.apiUrl}/reviews/${id}`, dto);
  }

  deleteReview(id: number) {
    return this.http.delete(`${environment.apiUrl}/reviews/${id}`);
  }

  setReviewApproval(id: number, isApproved: boolean) {
    return this.http.put(`${environment.apiUrl}/reviews/${id}/hide`, { isApproved });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  search(term: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?term=${term}`);
  }

  create(product: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: number, product: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
