import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { CouponService } from '../../services/coupon.service';
import { Coupon } from '../../models/coupon.model';

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './admin-coupons.html',
  styleUrl: './admin-coupons.css'
})
export class AdminCoupons implements OnInit {
  private router = inject(Router);
  private couponService = inject(CouponService);

  coupons = signal<Coupon[]>([]);
  editing: Coupon | null = null;

  form: Coupon = {
    code: '',
    description: '',
    isPercentage: false,
    discountValue: 0,
    maxDiscount: 0,
    startAt: null,
    expiryAt: null,
    isActive: true
  };

  ngOnInit() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) { this.router.navigate(['/login']); return; }
    this.load();
  }

  load() {
    this.couponService.getAll().subscribe(c => this.coupons.set(c));
  }

  edit(c: Coupon) {
    this.editing = c;
    this.form = { ...c } as Coupon;
  }

  clear() {
    this.editing = null;
    this.form = { code: '', description: '', isPercentage: false, discountValue: 0, maxDiscount: 0, startAt: null, expiryAt: null, isActive: true };
  }

  submit() {
    // trim code to avoid accidental spaces
    const payload = { ...this.form, code: (this.form.code || '').trim() };
    if (this.editing?.id) {
      this.couponService.update(this.editing.id, payload).subscribe({ next: () => { alert('Cập nhật coupon'); this.load(); this.clear(); }, error: () => alert('Lỗi') });
    } else {
      this.couponService.create(payload).subscribe({ next: () => { alert('Tạo coupon'); this.load(); this.clear(); }, error: () => alert('Lỗi') });
    }
  }

  remove(id?: number) {
    if (!id) return;
    if (!confirm('Xóa coupon này?')) return;
    this.couponService.delete(id).subscribe({ next: () => { this.load(); }, error: () => alert('Lỗi') });
  }
}
