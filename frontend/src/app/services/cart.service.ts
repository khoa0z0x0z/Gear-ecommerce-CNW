import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
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
  }

  private loadCartFromStorage(): CartItem[] {
    const savedCart = localStorage.getItem('kat_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  addToCart(product: Product, quantity: number = 1) {
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
    this.cartItemsSignal.update(items => items.filter(item => item.id !== id));
  }

  updateQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(id);
      return;
    }
    this.cartItemsSignal.update(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  clearCart() {
    this.cartItemsSignal.set([]);
  }
}
