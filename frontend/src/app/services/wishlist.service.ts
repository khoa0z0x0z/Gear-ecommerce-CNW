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

  wishlistCount = signal(0);

  getWishlist(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      tap((res: any) => {
        if (res && res.items) {
          this.wishlistCount.set(res.items.length);
        }
      })
    );
  }

  addToWishlist(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}`, {}).pipe(
      tap(() => this.wishlistCount.update(c => c + 1))
    );
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`).pipe(
      tap(() => this.wishlistCount.update(c => Math.max(0, c - 1)))
    );
  }

  loadInitialCount() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      this.getWishlist().subscribe();
    }
  }
}
