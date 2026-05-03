import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/product.model';

type AdminProduct = {
  id: number;
  name: string;
  sold: number;
  price: string;
  priceValue: number;
  category: string;
  status: 'Active' | 'Out of stock';
  image: string;
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  selectedCategory = 'all';
  selectedPriceRange = 'all';
  selectedStatus = 'all';
  selectedSort = 'sold-desc';

  products = signal<AdminProduct[]>([]);
  categories = signal<Category[]>([]);

  ngOnInit() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadData();
  }

  loadData() {
    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories.set(cats)
    });

    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (data) => {
        const mapped: AdminProduct[] = data.map(p => ({
          id: p.id,
          name: p.name,
          sold: p.sold || 0,
          price: (p.price || 0).toLocaleString('vi-VN') + 'đ',
          priceValue: p.price,
          category: p.categoryName || '',
          status: 'Active',
          image: (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls[0] : (p.image || 'https://via.placeholder.com/300')
        }));
        this.products.set(mapped);
      }
    });
  }

  get filteredProducts(): AdminProduct[] {
    const byCategory = this.products().filter((product) => {
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

  logout() {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/login']);
  }

  goAddProduct() {
    this.router.navigate(['/admin/add-product']);
  }

  goToLogs() {
    this.router.navigate(['/admin/logs']);
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/edit-product', id]);
  }

  deleteProduct(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          alert('Xóa sản phẩm thành công!');
          this.loadData();
        },
        error: (err) => alert('Lỗi khi xóa sản phẩm')
      });
    }
  }
}
