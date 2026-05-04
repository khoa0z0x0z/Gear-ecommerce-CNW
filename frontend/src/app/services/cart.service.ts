import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem, Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/carts`;

  private readonly STORAGE_KEY = 'kat_guest_cart'; // renamed to make role clear

  // Main signal — initialized to [] when logged in, from storage when guest
  private cartItemsSignal = signal<CartItem[]>(this.initCart());

  cartItems = computed(() => this.cartItemsSignal());
  totalCount = computed(() => this.cartItemsSignal().reduce((s, i) => s + i.quantity, 0));
  totalPrice = computed(() => this.cartItemsSignal().reduce((s, i) => s + i.price * i.quantity, 0));

  constructor() {


    // React to login/logout transitions
    effect(() => {
      const loggedIn = this.authService.isLoggedIn();
      if (loggedIn) {
        // Check if there's a guest cart to merge, then load from backend
        const guestItems = this.getGuestCart();
        if (guestItems.length > 0) {
          this.syncGuestCartThenLoad(guestItems);
        } else {
          this.loadCartFromBackend();
        }
      } else {
        // Logged out — restore guest cart from storage
        this.cartItemsSignal.set(this.getGuestCart());
      }
    }, { allowSignalWrites: true });
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  /** On service init, if already logged in start with [] (backend will load later).
   *  If guest, start from localStorage. */
  private initCart(): CartItem[] {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return isLoggedIn ? [] : this.getGuestCart();
  }

  private getGuestCart(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private clearGuestCart() {
    localStorage.removeItem(this.STORAGE_KEY);
    // Also clear old key from previous implementation
    localStorage.removeItem('kat_cart');
  }

  private syncGuestCartThenLoad(items: CartItem[]) {
    const payload = items.map(i => ({ productId: i.id, quantity: i.quantity }));
    this.http.post<any>(`${this.apiUrl}/sync`, payload).subscribe({
      next: () => { this.clearGuestCart(); this.loadCartFromBackend(); },
      error: () => { this.clearGuestCart(); this.loadCartFromBackend(); }
    });
  }

  private saveGuestCart() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItemsSignal()));
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  loadCartFromBackend() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (cart) => {
        if (cart?.items) {
          this.cartItemsSignal.set(cart.items.map((i: any): CartItem => ({
            id: i.productId,
            name: i.productName,
            price: i.price,
            quantity: i.quantity,
            image: i.imageUrl || '',
            description: ''
          })));
        }
      }
    });
  }

  addToCart(product: Product, quantity = 1) {
    if (this.authService.isLoggedIn()) {
      this.http.post(`${this.apiUrl}/items`, { productId: product.id, quantity })
        .subscribe({ next: () => this.loadCartFromBackend() });
      return;
    }
    // Guest
    this.cartItemsSignal.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...items, { ...product, quantity }];
    });
    this.saveGuestCart();
  }

  removeFromCart(id: number) {
    if (this.authService.isLoggedIn()) {
      this.http.delete(`${this.apiUrl}/items/${id}`)
        .subscribe({ next: () => this.loadCartFromBackend() });
      return;
    }
    this.cartItemsSignal.update(items => items.filter(i => i.id !== id));
    this.saveGuestCart();
  }

  updateQuantity(id: number, quantity: number) {
    if (quantity <= 0) { this.removeFromCart(id); return; }
    if (this.authService.isLoggedIn()) {
      this.http.put(`${this.apiUrl}/items`, { productId: id, quantity })
        .subscribe({ next: () => this.loadCartFromBackend() });
      return;
    }
    this.cartItemsSignal.update(items =>
      items.map(i => i.id === id ? { ...i, quantity } : i)
    );
    this.saveGuestCart();
  }

  clearCart() {
    if (this.authService.isLoggedIn()) {
      this.http.delete(this.apiUrl)
        .subscribe({ next: () => this.cartItemsSignal.set([]) });
      return;
    }
    this.cartItemsSignal.set([]);
    this.saveGuestCart();
  }
}
