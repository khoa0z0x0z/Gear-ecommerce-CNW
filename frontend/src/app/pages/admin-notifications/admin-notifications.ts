import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css'
})
export class AdminNotifications implements OnInit {
  private router = inject(Router);
  private svc = inject(NotificationService);

  notifications = signal<Notification[]>([]);
  editing: Notification | null = null;

  form: Notification = { title: '', message: '', visibleToRoles: '', visibleToUserIds: '', expiresAt: null, isActive: true };

  ngOnInit() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) { this.router.navigate(['/login']); return; }
    this.load();
  }

  load() { this.svc.getAll().subscribe(n => this.notifications.set(n)); }

  edit(n: Notification) { this.editing = n; this.form = { ...n }; }
  clear() { this.editing = null; this.form = { title: '', message: '', visibleToRoles: '', visibleToUserIds: '', expiresAt: null, isActive: true }; }

  submit() {
    const payload = { ...this.form };
    if (this.editing?.id) {
      this.svc.update(this.editing.id, payload).subscribe({
        next: () => {
          alert('Cập nhật thông báo thành công!');
          this.load();
          this.clear();
        },
        error: (err) => {
          console.error('Update Notification Error:', err);
          const msg = err.error?.message || err.error || 'Lỗi không xác định';
          alert('Lỗi cập nhật: ' + msg);
        }
      });
    } else {
      this.svc.create(payload).subscribe({
        next: () => {
          alert('Tạo thông báo thành công!');
          this.load();
          this.clear();
        },
        error: (err) => {
          console.error('Create Notification Error:', err);
          const msg = err.error?.message || err.error || 'Lỗi không xác định';
          alert('Lỗi khi tạo: ' + msg);
        }
      });
    }
  }

  remove(id?: number) {
    if (!id) return; if (!confirm('Xóa thông báo?')) return;
    this.svc.delete(id).subscribe({ next: () => this.load(), error: () => alert('Lỗi') });
  }
}
