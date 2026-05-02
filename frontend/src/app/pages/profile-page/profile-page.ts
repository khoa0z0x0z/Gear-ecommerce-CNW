import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  profile = signal<any>(null);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      this.router.navigate(['/login']);
      return;
    }

    const userId = parseInt(userIdStr, 10);
    this.userService.getProfile(userId).subscribe({
      next: (data) => {
        this.profile.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching profile', err);
        this.isLoading.set(false);
      }
    });
  }
}
