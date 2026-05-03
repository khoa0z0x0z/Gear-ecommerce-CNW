import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

import { OrderService } from '../../services/order.service';
import { CouponService } from '../../services/coupon.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css'
})
export class CheckoutPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private couponService = inject(CouponService);

  // States
  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  checkoutForm!: FormGroup;
  appliedDiscount = signal<number>(0);
  appliedCouponCode = signal<string | null>(null);

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để tiến hành thanh toán!');
      this.router.navigate(['/login']);
      return;
    }

    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      companyName: [''],
      streetAddress: ['', Validators.required],
      apartment: [''],
      townCity: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      emailAddress: ['', [Validators.required, Validators.email]],
      paymentMethod: ['cash', Validators.required],
      couponCode: [''],
      saveInfo: [false]
    });
  }

  applyCoupon() {
    const code = this.checkoutForm.get('couponCode')?.value;
    if (!code) {
      alert('Vui lòng nhập mã coupon');
      return;
    }

    const subtotal = this.totalPrice();
    this.couponService.validate(code, subtotal).subscribe({
      next: (res) => {
        const d = res.discount ?? 0;
        this.appliedDiscount.set(d);
        this.appliedCouponCode.set(code);
        alert('Coupon áp dụng: -' + d + ' VNĐ');
      },
      error: (err) => {
        console.error('Coupon error', err);
        alert('Coupon không hợp lệ hoặc đã hết hạn');
      }
    });
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      alert('Vui lòng điền đầy đủ và đúng định dạng các thông tin có dấu (*) để KAT Store giao hàng chính xác cho bạn nhé!');
      return;
    }

    if (this.cartItems().length === 0) {
      alert('Giỏ hàng trống! Vui lòng chọn sản phẩm trước khi thanh toán.');
      this.router.navigate(['/']);
      return;
    }

    const form = this.checkoutForm.value;
    const orderBody = {
      addressId: 0,
      note: form.companyName || '',
      city: form.townCity,
      fullAddress: `${form.streetAddress}${form.apartment ? ', ' + form.apartment : ''}`,
      couponCode: this.appliedCouponCode() || form.couponCode || null
    };

    this.orderService.createOrder(orderBody).subscribe({
      next: (res) => {
        alert('🎉 Đặt hàng thành công! Mã đơn hàng của bạn là #' + res.id);
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Order Error:', err);
        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
      }
    });
  }

  // Helper for validation display
  isInvalid(controlName: string) {
    const control = this.checkoutForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }
}