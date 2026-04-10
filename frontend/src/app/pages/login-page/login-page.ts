import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private readonly adminEmail = 'admin@gmail.com';
  private readonly adminPassword = '123456';

  loginForm!: FormGroup;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  handleLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.errorMessage = null;

    // Allow admin login directly from the default login page.
    if (email === this.adminEmail && password === this.adminPassword) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      alert('Đăng nhập admin thành công!');
      this.router.navigate(['/admin']);
      return;
    }

    localStorage.removeItem('isAdminLoggedIn');

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        alert('🎉 Đăng nhập thành công! Chào mừng bạn quay lại hệ thống.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Email hoặc mật khẩu không đúng!';
      }
    });
  }

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }
}