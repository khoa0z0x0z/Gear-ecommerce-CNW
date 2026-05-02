import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/wishlists`;

  // Signal to store current wishlist count for header
  wishlistCount = signal<number>(0);

  getWishlist(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(res => {
        if (res && res.items) {
          this.wishlistCount.set(res.items.length);
        }
      })
    );
  }

  addToWishlist(productId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${productId}`, {}).pipe(
      tap(() => {
        // Need to refetch or manually update count. For simplicity we just increase it or refetch
        this.wishlistCount.update(c => c + 1);
      })
    );
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`).pipe(
      tap(() => {
        this.wishlistCount.update(c => Math.max(0, c - 1));
      })
    );
  }

  loadInitialCount() {
    // Only load if logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        this.getWishlist().subscribe();
    }
  }
}
