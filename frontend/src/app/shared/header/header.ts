import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header', // Giữ nguyên tên selector cũ của bạn nếu nó khác nha
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  // Biến dùng để bật/tắt cái menu xổ xuống
  showDropdown = false;

  // Tự động kiểm tra xem đã đăng nhập chưa
  get isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Bấm vào avatar thì Mở/Đóng menu
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  // Hàm Đăng xuất
  logout() {
    localStorage.removeItem('isLoggedIn'); // Vứt thẻ VIP đi
    this.showDropdown = false; // Đóng menu lại
    alert('Bạn đã đăng xuất thành công!');
  }
}