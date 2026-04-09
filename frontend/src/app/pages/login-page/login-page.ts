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
    if (!this.emailOrPhone || !this.password) {
      alert('Vui lòng nhập đầy đủ Email/Số điện thoại và Mật khẩu!');
      return;
    }

    alert('🎉 Đăng nhập thành công! Chào mừng bạn quay lại hệ thống.');
    
    localStorage.setItem('isLoggedIn', 'true');
    
    this.router.navigate(['/']); 
  }

  forgotPassword() {
    alert('Hệ thống đang bảo trì chức năng Quên mật khẩu. Vui lòng quay lại sau!');
  }
}