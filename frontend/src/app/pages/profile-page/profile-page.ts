import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
  private http = inject(HttpClient);

  profile = signal<any>(null);
  isLoading = signal<boolean>(true);

  editData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatarUrl: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

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
        const names = data.fullName?.split(' ') || [];
        this.editData.firstName = names[0] || '';
        this.editData.lastName = names.slice(1).join(' ') || '';
        this.editData.email = data.email || '';
        this.editData.phone = data.phone || '';
        // load local avatar if present
        this.editData.avatarUrl = localStorage.getItem('avatarUrl') || '';
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching profile', err);
        this.isLoading.set(false);
      }
    });
  }

  onAvatarSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Preview immediately locally while uploading
    const reader = new FileReader();
    reader.onload = () => {
      this.editData.avatarUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>(`${environment.apiUrl}/upload/avatar`, formData).subscribe({
      next: (res) => {
        // Replace base64 preview with real URL
        this.editData.avatarUrl = res.url;
      },
      error: (err) => {
        alert('Failed to upload avatar: ' + (err.error?.message || err.message));
      }
    });
  }

  saveChanges() {
    if (this.editData.newPassword && this.editData.newPassword !== this.editData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    const payload = {
      fullName: `${this.editData.firstName} ${this.editData.lastName}`.trim(),
      email: this.editData.email,
      phone: this.editData.phone,
      avatarUrl: this.editData.avatarUrl,
      currentPassword: this.editData.currentPassword,
      newPassword: this.editData.newPassword
    };

    this.userService.updateProfile(payload).subscribe({
      next: (res) => {
        alert('Profile updated successfully');
        // Reset password fields
        this.editData.currentPassword = '';
        this.editData.newPassword = '';
        this.editData.confirmPassword = '';

        // Update local profile data
        this.profile.update(p => ({
          ...p,
          fullName: payload.fullName,
          phone: payload.phone,
          email: payload.email
        }));
        // Avatar is stored client-side only
        if (this.editData.avatarUrl) {
          localStorage.setItem('avatarUrl', this.editData.avatarUrl);
          window.dispatchEvent(new CustomEvent('avatarChanged', { detail: this.editData.avatarUrl }));
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Update failed. Please check your current password.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
