import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css'
})
export class AdminSettings implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab = signal<'store' | 'shipping' | 'payment' | 'security'>('store');
  settings = signal<any[]>([]);

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.adminService.getSettings().subscribe({
      next: (data) => this.settings.set(data),
      error: (err) => console.error('Error loading settings', err)
    });
  }

  getSettingsByGroup(group: string) {
    return this.settings().filter(s => s.group === group);
  }

  saveSettings() {
    this.adminService.saveSettings(this.settings()).subscribe({
      next: () => alert('Cấu hình đã được lưu thành công! ✅'),
      error: (err) => alert('Có lỗi xảy ra khi lưu cấu hình. ❌')
    });
  }

  changePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp! ❌');
      return;
    }

    const userId = localStorage.getItem('userId');
    const adminId = userId ? parseInt(userId, 10) : null;
    if (!adminId) { alert('Không tìm thấy thông tin Admin. ❌'); return; }

    this.adminService.resetCustomerPassword(adminId, this.passwordForm.newPassword).subscribe({
      next: () => {
        alert('Đổi mật khẩu thành công! 🔑');
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: (err) => alert('Lỗi khi đổi mật khẩu! ❌')
    });
  }

  logout() {
    this.authService.logout(); // hard-redirects to /login automatically
  }
}
