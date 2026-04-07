import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css'
})
export class RegisterPage {
  name: string = '';
  emailOrPhone: string = '';
  password: string = '';

  createAccount() {
    // 1. Kiểm tra rỗng
    if (!this.name || !this.emailOrPhone || !this.password) {
      alert('Vui lòng điền đầy đủ thông tin vào các trường bắt buộc (*) nhé!');
      return;
    }
    
    // 2. Kiểm tra độ dài mật khẩu
    if (this.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự để đảm bảo an toàn cho tài khoản của bạn.');
      return;
    }

    // 3. Đăng ký thành công
    alert('🎉 Chúc mừng ' + this.name + '! Đăng ký tài khoản thành công.');
    
    // 4. Xóa trắng form sau khi đăng ký
    this.name = '';
    this.emailOrPhone = '';
    this.password = '';
  }
}