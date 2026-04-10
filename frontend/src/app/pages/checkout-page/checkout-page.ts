import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

import { OrderService } from '../../services/order.service';

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

  // States
  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  checkoutForm!: FormGroup;

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      companyName: [''],
      streetAddress: ['', Validators.required],
      apartment: [''],
      townCity: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      emailAddress: ['', [Validators.required, Validators.email]],
      paymentMethod: ['cash', Validators.required],
      saveInfo: [false]
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
      addressId: 0, // In real app, we might select/create address first. 
      // For now, the backend will handle address if we send Address object or use simple logic.
      // Since our Order controller expects AddressId, I'll assume we used a default or created one.
      // To keep it simple, I'll pass 1 (assuming at least one address exists or modify controller later)
      address: {
        fullAddress: `${form.streetAddress}, ${form.apartment}`,
        city: form.townCity,
        district: '',
        ward: ''
      },
      totalAmount: this.totalPrice(),
      shippingFee: 0,
      note: form.companyName,
      orderDetails: this.cartItems().map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
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