import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css'
})
export class AdminSettings implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  // Dữ liệu mặc định của form settings
  settings = {
    storeName: 'My Store',
    email: 'admin@example.com',
    currency: 'VND'
  };

  saveSettings() {
    alert('Settings saved successfully!');
    // Ở đây bạn có thể gọi API để lưu vào database
  }

  // Các hàm điều hướng Sidebar
  logout() {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/login']);
  }
}