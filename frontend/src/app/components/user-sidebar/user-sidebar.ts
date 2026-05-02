import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="user-sidebar">
      <div class="sidebar-section">
        <h3 class="section-title">Manage My Account</h3>
        <ul class="nav-list">
          <li>
            <a routerLink="/profile" routerLinkActive="active">
              <i class="bi bi-person me-2"></i> My Profile
            </a>
          </li>
          <li>
            <a routerLink="/address" routerLinkActive="inactive">
              <i class="bi bi-geo-alt me-2"></i> Address Book
            </a>
          </li>
          <li>
            <a routerLink="/payment-options" routerLinkActive="inactive">
              <i class="bi bi-credit-card me-2"></i> My Payment Options
            </a>
          </li>
        </ul>
      </div>

      <div class="sidebar-section">
        <h3 class="section-title">My Orders</h3>
        <ul class="nav-list">
          <li>
            <a routerLink="/order-history" routerLinkActive="active">
              <i class="bi bi-bag me-2"></i> Order History
            </a>
          </li>
          <li>
            <a routerLink="/cancellations" routerLinkActive="inactive">
              <i class="bi bi-x-circle me-2"></i> My Cancellations
            </a>
          </li>
        </ul>
      </div>

      <div class="sidebar-section">
        <h3 class="section-title">My Wishlist</h3>
        <ul class="nav-list">
          <li>
            <a routerLink="/wishlist" routerLinkActive="active">
              <i class="bi bi-heart me-2"></i> Wishlist
            </a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .user-sidebar {
      padding: 0;
    }
    .sidebar-section {
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #000;
      margin-bottom: 12px;
      padding-left: 10px;
    }
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .nav-list li {
      margin-bottom: 2px;
    }
    .nav-list a {
      text-decoration: none;
      color: #7d879c;
      font-size: 0.88rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 4px;
    }
    .nav-list a:hover {
      color: #db4444;
      background: rgba(219, 68, 68, 0.05);
    }
    .nav-list a.active {
      color: #db4444;
      font-weight: 500;
      background: rgba(219, 68, 68, 0.08);
    }
    .bi {
      font-size: 1.1rem;
    }
  `]
})
export class UserSidebar {}
