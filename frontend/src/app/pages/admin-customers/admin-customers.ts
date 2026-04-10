import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

type CustomerStatus = 'Active' | 'Inactive';

type Customer = {
  name: string;
  email: string;
  orders: number;
  totalSpent: string;
  status: CustomerStatus;
};

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-customers.html',
  styleUrl: './admin-customers.css'
})
export class AdminCustomers implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  customers: Customer[] = [
    { name: 'Nguyễn Văn A', email: 'customer@example.com', orders: 12, totalSpent: '27.590.000đ', status: 'Active' },
    { name: 'Trần Thị B', email: 'customer@example.com', orders: 12, totalSpent: '22.990.000đ', status: 'Active' },
    { name: 'Lê Văn C', email: 'customer@example.com', orders: 12, totalSpent: '32.990.000đ', status: 'Inactive' },
    { name: 'Phạm Thị D', email: 'customer@example.com', orders: 12, totalSpent: '25.990.000đ', status: 'Active' }
  ];

  logout() {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/login']);
  }
}