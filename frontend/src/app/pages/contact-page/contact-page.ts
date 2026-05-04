import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css'
})
export class ContactPage {
  private contactService = inject(ContactService);

  userName: string = '';
  userEmail: string = '';
  userPhone: string = '';
  userMessage: string = '';

  sendMessage() {
    if (!this.userName || !this.userEmail || !this.userPhone || !this.userMessage) {
      alert('Vui lòng điền đầy đủ thông tin vào các trường bắt buộc (*) trước khi gửi.');
      return;
    }

    const payload = {
      name: this.userName,
      email: this.userEmail,
      phone: this.userPhone,
      message: this.userMessage
    };

    this.contactService.sendMessage(payload).subscribe({
      next: () => {
        alert('🎉 Cảm ơn ' + this.userName + '! Tin nhắn của bạn đã được gửi thành công.');
        this.userName = '';
        this.userEmail = '';
        this.userPhone = '';
        this.userMessage = '';
      },
      error: (err: any) => {
        alert('Gửi tin nhắn thất bại. Vui lòng thử lại sau.');
        console.error(err);
      }
    });
  }
}