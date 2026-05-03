import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private wishlistService = inject(WishlistService);

  isLoggedIn = this.authService.isLoggedIn;
  cartCount = this.cartService.totalCount;
  wishlistCount = this.wishlistService.wishlistCount;
  
  showDropdown = false;
  avatarUrl: string | null = localStorage.getItem('avatarUrl');

  constructor() {
    this.wishlistService.loadInitialCount();
    // Listen for avatar changes from profile page
    window.addEventListener('avatarChanged', (e: Event) => {
      const ev = e as CustomEvent<string>;
      this.avatarUrl = ev.detail || localStorage.getItem('avatarUrl');
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
  }
}