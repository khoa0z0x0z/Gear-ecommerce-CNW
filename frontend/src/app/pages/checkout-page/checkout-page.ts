import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

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

    const orderData = this.checkoutForm.value;
    console.log('Order Placement:', orderData, this.cartItems());

    alert('🎉 Đặt hàng thành công! Mã đơn hàng của bạn là #KAT' + Math.floor(Math.random() * 10000));
    
    // Clear cart
    this.cartService.clearCart();
    this.router.navigate(['/']);
  }

  // Helper for validation display
  isInvalid(controlName: string) {
    const control = this.checkoutForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }
}