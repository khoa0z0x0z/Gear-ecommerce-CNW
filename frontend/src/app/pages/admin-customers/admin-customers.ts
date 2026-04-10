import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './admin-customers.html',
  styleUrl: './admin-customers.css'
})
export class AdminCustomers implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  customers = signal<any[]>([]);
  selectedCustomer = signal<any | null>(null);

  ngOnInit() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadCustomers();
  }

  loadCustomers() {
    this.adminService.getCustomers().subscribe({
      next: (data) => this.customers.set(data),
      error: (err) => console.error('Error loading customers', err)
    });
  }

  onViewDetails(id: number) {
    this.adminService.getCustomerDetails(id).subscribe({
      next: (data) => this.selectedCustomer.set(data),
      error: (err) => alert('Error loading customer details')
    });
  }

  closeDetails() {
    this.selectedCustomer.set(null);
  }

  onToggleStatus(id: number) {
    if (confirm('Bạn có chắc muốn thay đổi trạng thái tài khoản này?')) {
      this.adminService.toggleCustomerStatus(id).subscribe({
        next: () => {
          this.loadCustomers(); // Reload list
          if (this.selectedCustomer()?.id === id) {
            this.onViewDetails(id); // Reload modal details if open
          }
        },
        error: (err) => alert('Error updating status')
      });
    }
  }

  onResetPassword(id: number) {
    if (confirm('Bạn có chắc muốn cấp lại mật khẩu cho khách hàng này? Mật khẩu sẽ được đặt về mặc định.')) {
      const defaultPass = '123456';
      this.adminService.resetCustomerPassword(id, defaultPass).subscribe({
        next: () => alert('Đã cấp lại mật khẩu thành công!'),
        error: (err) => alert('Error resetting password')
      });
    }
  }

  logout() {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}