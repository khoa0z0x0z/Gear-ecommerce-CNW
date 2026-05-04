import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CouponService } from '../../services/coupon.service';
import { SettingsService } from '../../services/settings.service';
import { environment } from '../../../environments/environment';

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
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private couponService = inject(CouponService);
  private settingsService = inject(SettingsService);
  private apiBase = environment.apiUrl;

  // States
  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  checkoutForm!: FormGroup;
  appliedDiscount = signal<number>(0);
  appliedCouponCode = signal<string | null>(null);

  activeCoupons = signal<any[]>([]);
  showCouponPicker = signal<boolean>(false);

  // Shipping logic via signals
  shippingFeeSetting = computed(() => Number(this.settingsService.getSetting('ShippingFee')) || 30000);
  freeShippingThreshold = computed(() => Number(this.settingsService.getSetting('FreeShippingThreshold')) || 2000000);

  calculatedShipping = computed(() => {
    return this.totalPrice() >= this.freeShippingThreshold() ? 0 : this.shippingFeeSetting();
  });

  finalTotal = computed(() => {
    return this.totalPrice() - this.appliedDiscount() + this.calculatedShipping();
  });

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

    this.settingsService.fetchPublicSettings().subscribe();
    this.couponService.getActive().subscribe(data => this.activeCoupons.set(data));
  }

  toggleCouponPicker() {
    this.showCouponPicker.set(!this.showCouponPicker());
  }

  selectCoupon(coupon: any) {
    this.checkoutForm.patchValue({ couponCode: coupon.code });
    this.showCouponPicker.set(false);
    this.applyCoupon();
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
        alert('Coupon áp dụng: -' + d.toLocaleString() + ' VNĐ');
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

    if (form.paymentMethod === 'vnpay') {
      // VNPay: create order on backend, then redirect to payment gateway
      this.http.post<any>(`${this.apiBase}/vnpay/create-payment`, orderBody).subscribe({
        next: (res) => {
          this.cartService.clearCart();
          // Redirect browser to VNPay gateway
          window.location.href = res.paymentUrl;
        },
        error: (err) => {
          console.error('VNPay Error:', err);
          alert('Có lỗi khi tạo link thanh toán VNPay. Vui lòng thử lại!');
        }
      });
    } else {
      // COD
      this.orderService.createOrder(orderBody).subscribe({
        next: (res) => {
          alert('🎉 Đặt hàng thành công! Mã đơn hàng của bạn là #' + res.id);
          this.cartService.clearCart();
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          console.error('Order Error:', err);
          alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
        }
      });
    }
  }

  // Helper for validation display
  isInvalid(controlName: string) {
    const control = this.checkoutForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }
}