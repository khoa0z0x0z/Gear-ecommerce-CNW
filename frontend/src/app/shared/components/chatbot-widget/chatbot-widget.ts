import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatResponse, RecommendedProduct } from '../../../services/chatbot.service';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  products?: RecommendedProduct[];
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-widget.html',
  styleUrls: ['./chatbot-widget.css']
})
export class ChatbotWidget {
  @ViewChild('chatBody', { static: false }) private chatBody?: ElementRef;

  isOpen = false;
  userInput = '';
  isTyping = false;

  messages: ChatMessage[] = [
    { role: 'bot', text: 'Xin chào! KAT Chat có thể giúp gì cho bạn? (Ví dụ: Tư vấn laptop AI dưới 30 triệu)' }
  ];

  constructor(
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef
  ) { }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  scrollToBottom(): void {
    try {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    } catch (err: any) { }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userText = this.userInput;
    this.messages.push({ role: 'user', text: userText });
    this.userInput = '';
    this.isTyping = true;

    // Force UI render and scroll down for User message
    this.cdr.detectChanges();
    setTimeout(() => this.scrollToBottom(), 50);

    this.chatbotService.sendMessage(userText).subscribe({
      next: (res: ChatResponse) => {
        this.isTyping = false;
        this.messages.push({
          role: 'bot',
          text: res.aiMessage,
          products: res.recommendedProducts
        });

        // Force UI render and scroll down for AI response
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err: any) => {
        this.isTyping = false;
        this.messages.push({
          role: 'bot',
          text: 'Rất tiếc, AI đang bận hoặc hệ thống xảy ra lỗi kết nối. Bạn nhớ chạy backend bằng HTTPS profile nhé!'
        });
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  formatHtml(text: string): string {
    return text.replace(/\n/g, '<br/>');
  }
}
