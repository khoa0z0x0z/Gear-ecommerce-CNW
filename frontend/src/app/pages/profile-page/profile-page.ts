import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserProfile } from '../../services/user.service';
import { UserSidebar } from '../../components/user-sidebar/user-sidebar';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, UserSidebar],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements OnInit {
  private userService = inject(UserService);

  profile = signal<UserProfile | null>(null);
  
  // Form fields
  fullName = '';
  phone = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  message = signal('');
  isError = signal(false);

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.profile.set(res);
        this.fullName = res.fullName;
        this.phone = res.phone || '';
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.showMessage('Confirm password does not match', true);
      return;
    }

    const updateData = {
      fullName: this.fullName,
      phone: this.phone,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.userService.updateProfile(updateData).subscribe({
      next: () => {
        this.showMessage('Profile updated successfully!', false);
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.loadProfile();
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Failed to update profile', true);
      }
    });
  }

  showMessage(msg: string, error: boolean) {
    this.message.set(msg);
    this.isError.set(error);
    setTimeout(() => this.message.set(''), 3000);
  }
}
