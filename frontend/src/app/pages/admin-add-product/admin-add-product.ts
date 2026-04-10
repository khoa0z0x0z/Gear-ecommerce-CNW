import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-add-product.html',
  styleUrl: './admin-add-product.css'
})
export class AdminAddProduct implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  product = {
    name: '',
    category: '',
    sku: '',
    price: '',
    stock: '',
    status: '',
    description: '',
    image: ''
  };

  submit() {
    alert('Đã thêm sản phẩm');
    this.router.navigate(['/admin']);
  }

  cancel() {
    this.router.navigate(['/admin']);
  }

  logout() {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/login']);
  }
}