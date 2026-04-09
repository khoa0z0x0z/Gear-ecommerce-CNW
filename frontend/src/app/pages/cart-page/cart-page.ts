import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage implements OnInit {
  cartItems: any[] = []; // Bắt đầu với giỏ trống

  constructor(private router: Router) {}

  // Tự động load đồ từ tủ
  ngOnInit() {
    const savedCart = localStorage.getItem('kat_cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart); 
    }
  }

  // Cập nhật lại tủ đồ khi có thay đổi
  updateStorage() {
    localStorage.setItem('kat_cart', JSON.stringify(this.cartItems));
  }

  increaseQty(item: any) {
    item.quantity++;
    this.updateStorage(); 
  }

  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateStorage(); 
    }
  }

  removeItem(id: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.updateStorage(); 
  }

  getSubtotal() {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  checkout() {
    if (this.cartItems.length === 0) {
      alert('Giỏ hàng đang trống! Vui lòng quay lại trang chủ chọn đồ nha.');
    } else {
      this.router.navigate(['/checkout']);
    }
  }
}