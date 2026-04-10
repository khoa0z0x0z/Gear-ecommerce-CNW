import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

type AdminProduct = {
  name: string;
  sold: number;
  price: string;
  priceValue: number;
  category: 'Phone' | 'Laptop' | 'Tablet';
  status: 'Active' | 'Out of stock';
  image: string;
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  constructor(private router: Router) {}

  selectedCategory = 'all';
  selectedPriceRange = 'all';
  selectedStatus = 'all';
  selectedSort = 'sold-desc';

  products: AdminProduct[] = [
    {
      name: 'iPhone 15 Pro',
      sold: 234,
      price: '28.500.000đ',
      priceValue: 28500000,
      category: 'Phone',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop'
    },
    {
      name: 'Samsung Galaxy S24',
      sold: 189,
      price: '24.300.000đ',
      priceValue: 24300000,
      category: 'Phone',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1706372047074-8f9d1d0d2c5f?q=80&w=1200&auto=format&fit=crop'
    },
    {
      name: 'MacBook Air M3',
      sold: 156,
      price: '29.100.000đ',
      priceValue: 29100000,
      category: 'Laptop',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=1200&auto=format&fit=crop'
    },
    {
      name: 'iPad Pro',
      sold: 143,
      price: '23.700.000đ',
      priceValue: 23700000,
      category: 'Tablet',
      status: 'Out of stock',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  get filteredProducts(): AdminProduct[] {
    const byCategory = this.products.filter((product) => {
      return this.selectedCategory === 'all' || product.category === this.selectedCategory;
    });

    const byPrice = byCategory.filter((product) => {
      if (this.selectedPriceRange === 'all') return true;
      if (this.selectedPriceRange === 'under-25m') return product.priceValue < 25000000;
      if (this.selectedPriceRange === '25m-30m') return product.priceValue >= 25000000 && product.priceValue <= 30000000;
      return product.priceValue > 30000000;
    });

    const byStatus = byPrice.filter((product) => {
      return this.selectedStatus === 'all' || product.status === this.selectedStatus;
    });

    const sorted = [...byStatus];
    if (this.selectedSort === 'sold-desc') {
      sorted.sort((a, b) => b.sold - a.sold);
    } else if (this.selectedSort === 'price-asc') {
      sorted.sort((a, b) => a.priceValue - b.priceValue);
    } else if (this.selectedSort === 'price-desc') {
      sorted.sort((a, b) => b.priceValue - a.priceValue);
    }

    return sorted;
  }

  resetFilters() {
    this.selectedCategory = 'all';
    this.selectedPriceRange = 'all';
    this.selectedStatus = 'all';
    this.selectedSort = 'sold-desc';
  }

  ngOnInit() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/login']);
  }

  goAddProduct() {
    this.router.navigate(['/admin/add-product']);
  }

  editProduct(productName: string) {
    alert(`Bạn vừa bấm Edit cho sản phẩm: ${productName}`);
  }

  goCustomers() {
    this.router.navigate(['/admin/customers']);
  }

  goSettings() {
    this.router.navigate(['/admin/settings']);
  }
}