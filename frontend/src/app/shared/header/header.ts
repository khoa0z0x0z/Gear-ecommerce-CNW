import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  isLoggedIn = this.authService.isLoggedIn;
  cartCount = this.cartService.totalCount;
  
  showDropdown = false;
  showNotif = false;
  notifications: any[] = [];
  notifCount = 0;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    const userIdStr = localStorage.getItem('userId');
    const userId = userIdStr ? parseInt(userIdStr, 10) : undefined;
    if (!userId) return;

    this.notificationService.getActive(userId).subscribe({ next: (res: any) => { this.notifications = res || []; this.notifCount = this.notifications.length; } });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleNotif() {
    this.showNotif = !this.showNotif;
    if (this.showNotif) this.loadNotifications();
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
  }
}