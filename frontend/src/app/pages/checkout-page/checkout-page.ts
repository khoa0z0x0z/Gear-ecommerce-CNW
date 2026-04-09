import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css'
})
export class CheckoutPage implements OnInit {
  constructor(private router: Router) {}

  firstName: string = '';
  companyName: string = '';
  streetAddress: string = '';
  apartment: string = '';
  townCity: string = '';
  phoneNumber: string = '';
  emailAddress: string = '';
  paymentMethod: string = 'cash';

  orderItems: any[] = [];

  // Tự động load dữ liệu từ tủ đồ
  ngOnInit() {
    const savedCart = localStorage.getItem('kat_cart');
    if (savedCart) {
      let items = JSON.parse(savedCart);
      this.orderItems = items.map((i: any) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.icon
      }));
    }
  }

  getSubtotal() {
    return this.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  placeOrder() {
    if (!this.firstName || !this.streetAddress || !this.townCity || !this.phoneNumber || !this.emailAddress) {
      alert('Vui lòng điền đầy đủ các thông tin có dấu (*) để KAT Store giao hàng chính xác cho bạn nhé!');
      return;
    }

    alert('🎉 Đặt hàng thành công! Mã đơn hàng của bạn là #KAT' + Math.floor(Math.random() * 10000));
    
    // Đặt xong thì dọn sạch tủ đồ
    localStorage.removeItem('kat_cart');
    this.router.navigate(['/']);
  }
}