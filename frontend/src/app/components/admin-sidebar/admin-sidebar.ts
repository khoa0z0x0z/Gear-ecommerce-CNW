import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css'
})
export class AdminSidebar {
  private router = inject(Router);
  @Output() logout = new EventEmitter<void>();

  onLogout() {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/login']);
    this.logout.emit();
  }
}
