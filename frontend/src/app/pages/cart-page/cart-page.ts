import { Component, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage {
  private cartService = inject(CartService);
  private router = inject(Router);

  // Bind to the service signals
  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;

  increaseQty(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQty(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity - 1);
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  checkout() {
    if (this.cartItems().length === 0) {
      alert('Giỏ hàng đang trống! Vui lòng quay lại trang chủ chọn đồ nha.');
    } else {
      this.router.navigate(['/checkout']);
    }
  }
}