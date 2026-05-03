import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css'
})
export class AdminSidebar {
  private router = inject(Router);
  private authService = inject(AuthService);
  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.emit();
    this.authService.logout(); // clears all localStorage keys + hard-redirects to /login
  }
}
