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

  // Main signal for cart items
  private cartItemsSignal = signal<CartItem[]>(this.loadCartFromStorage());

  // Computed signals for convenience
  cartItems = computed(() => this.cartItemsSignal());

  totalCount = computed(() =>
    this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItemsSignal().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  constructor() {
    // Automatically save to localStorage whenever the signal changes
    effect(() => {
      localStorage.setItem('kat_cart', JSON.stringify(this.cartItemsSignal()));
    });

    // Check login status and sync
    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.loadCartFromBackend();
      }
    });
  }

  private loadCartFromStorage(): CartItem[] {
    const savedCart = localStorage.getItem('kat_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  loadCartFromBackend() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (cart) => {
        if (cart && cart.items) {
          const items: CartItem[] = cart.items.map((item: any) => ({
            id: item.productId,
            name: item.productName,
            price: item.price,
            quantity: item.quantity,
            image: item.imageUrl || 'https://via.placeholder.com/150',
            description: ''
          }));
          this.cartItemsSignal.set(items);
        }
      }
    });
  }

  addToCart(product: Product, quantity: number = 1) {
    if (this.authService.isLoggedIn()) {
      this.http.post(`${this.apiUrl}/items`, { productId: product.id, quantity }).subscribe({
        next: () => this.loadCartFromBackend()
      });
      return;
    }

    this.cartItemsSignal.update(items => {
      const existingItem = items.find(item => item.id === product.id);
      if (existingItem) {
        return items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...items, { ...product, quantity }];
    });
  }

  removeFromCart(id: number) {
    if (this.authService.isLoggedIn()) {
      this.http.delete(`${this.apiUrl}/items/${id}`).subscribe({
        next: () => this.loadCartFromBackend()
      });
      return;
    }
    this.cartItemsSignal.update(items => items.filter(item => item.id !== id));
  }

  updateQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(id);
      return;
    }

    if (this.authService.isLoggedIn()) {
      this.http.post(`${this.apiUrl}/items`, { productId: id, quantity }).subscribe({
        next: () => this.loadCartFromBackend()
      });
      return;
    }

    this.cartItemsSignal.update(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  clearCart() {
    if (this.authService.isLoggedIn()) {
      this.http.delete(this.apiUrl).subscribe({
        next: () => this.cartItemsSignal.set([])
      });
      return;
    }
    this.cartItemsSignal.set([]);
  }
}
