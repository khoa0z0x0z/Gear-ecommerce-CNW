import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css'
})
export class ContactPage {
  userName: string = '';
  userEmail: string = '';
  userPhone: string = '';

  sendMessage() {
    if (!this.userName || !this.userEmail || !this.userPhone) {
      alert('Vui lòng điền đầy đủ thông tin vào các trường bắt buộc (*) trước khi gửi.');
      return; 
    }

    alert('🎉 Cảm ơn ' + this.userName + '! Tin nhắn của bạn đã được gửi thành công.');

    this.userName = '';
    this.userEmail = '';
    this.userPhone = '';
  }
}