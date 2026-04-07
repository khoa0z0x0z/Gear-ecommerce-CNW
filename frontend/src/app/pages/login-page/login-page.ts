import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  emailOrPhone = '';
  password = '';

  constructor(private router: Router) {}

  handleLogin() {
    // Kiểm tra trống
    if (!this.emailOrPhone || !this.password) {
      alert('Vui lòng nhập đầy đủ Email/Số điện thoại và Mật khẩu!');
      return;
    }

    // Đăng nhập thành công
    alert('🎉 Đăng nhập thành công! Chào mừng bạn quay lại hệ thống.');
    
    // CẤT THẺ VIP VÀO TỦ ĐỒ (Để Header biết đường đổi giao diện)
    localStorage.setItem('isLoggedIn', 'true');
    
    // Chuyển về trang chủ
    this.router.navigate(['/']); 
  }

  forgotPassword() {
    alert('Hệ thống đang bảo trì chức năng Quên mật khẩu. Vui lòng quay lại sau!');
  }
}