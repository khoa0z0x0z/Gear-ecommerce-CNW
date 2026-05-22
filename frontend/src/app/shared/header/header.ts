import { Component, inject, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { NotificationService } from '../../services/notification.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private wishlistService = inject(WishlistService);
  private notificationService = inject(NotificationService);

  private productService = inject(ProductService);
  private eRef = inject(ElementRef);
  private router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn;
  cartCount = this.cartService.totalCount;
  wishlistCount = this.wishlistService.wishlistCount;

  showDropdown = false;
  avatarUrl: string | null = localStorage.getItem('avatarUrl');

  showNotif = false;
  notifications: any[] = [];
  notifCount = 0;

  searchQuery = '';
  searchResults: Product[] = [];
  showSearchResults = false;
  private searchSubject = new Subject<string>();

  constructor() {
    this.wishlistService.loadInitialCount();
    // Listen for avatar changes from profile page
    window.addEventListener('avatarChanged', (e: Event) => {
      const ev = e as CustomEvent<string>;
      this.avatarUrl = ev.detail || localStorage.getItem('avatarUrl');
    });

    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term.trim()) {
        this.productService.search(term).subscribe({
          next: (res) => {
            this.searchResults = res;
            this.showSearchResults = res.length > 0;
          }
        });
      } else {
        this.searchResults = [];
        this.showSearchResults = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showSearchResults = false;
      this.showNotif = false;
      this.showDropdown = false;
    }
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }

  closeSearch() {
    this.showSearchResults = false;
    this.searchQuery = '';
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

  onSearch(term: string) {
    if (term.trim()) {
      this.router.navigate(['/products'], { queryParams: { q: term.trim() } });
    }
  }
}