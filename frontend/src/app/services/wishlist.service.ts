import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Wishlist {
  id: number;
  userId: number;
  items: WishlistItem[];
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7057/api/wishlists';

  private wishlistCountSubject = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor() {
    this.refreshWishlistCount();
  }

  getWishlist(): Observable<Wishlist> {
    return this.http.get<Wishlist>(this.apiUrl).pipe(
      tap(wishlist => this.wishlistCountSubject.next(wishlist.items.length))
    );
  }

  addToWishlist(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, { productId }).pipe(
      tap(() => this.refreshWishlistCount())
    );
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${productId}`).pipe(
      tap(() => this.refreshWishlistCount())
    );
  }

  private refreshWishlistCount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.getWishlist().subscribe({
        next: (wishlist) => this.wishlistCountSubject.next(wishlist.items.length),
        error: () => this.wishlistCountSubject.next(0)
      });
    }
  }
}
