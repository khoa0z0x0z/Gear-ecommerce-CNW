import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './admin-add-product.html',
  styleUrl: './admin-add-product.css'
})
export class AdminAddProduct implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  productId: number | null = null;
  categories = signal<Category[]>([]);

  product = {
    name: '',
    categoryId: 1,
    sku: '',
    price: 0,
    stock: 10,
    description: '',
    image: ''
  };

  ngOnInit() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.categoryService.getAll().subscribe(cats => this.categories.set(cats));

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number) {
    this.productService.getById(id).subscribe({
      next: (p: any) => {
        // Map category name back to ID if necessary
        let catId = p.categoryId;
        if (!catId && p.categoryName) {
          const found = this.categories().find(c => c.name === p.categoryName);
          if (found) catId = found.id;
        }

        this.product = {
          name: p.name,
          categoryId: catId || 1,
          sku: 'SKU-' + p.id,
          price: p.price,
          stock: 10,
          description: p.description,
          image: (p.imageUrls && p.imageUrls[0]) || p.image || ''
        };
      }
    });
  }

  submit() {
    const payload = {
      ...this.product,
      price: +this.product.price,
      ImageUrls: this.product.image ? [this.product.image] : []
    };

    if (this.productId) {
      this.productService.update(this.productId, payload).subscribe({
        next: () => {
          alert('Cập nhật sản phẩm thành công!');
          this.router.navigate(['/admin']);
        },
        error: (err) => alert('Lỗi khi cập nhật sản phẩm')
      });
    } else {
      this.productService.create(payload).subscribe({
        next: () => {
          alert('Thêm sản phẩm thành công!');
          this.router.navigate(['/admin']);
        },
        error: (err) => alert('Lỗi khi thêm sản phẩm')
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin']);
  }

  onFileSelected(event: any) {
    const file: File = event?.target?.files?.[0];
    if (!file) return;

    // Upload file to backend and set returned URL as product.image
    this.productService.uploadImage(file).subscribe({
      next: (res: any) => {
        this.product.image = res.url;
      },
      error: () => alert('Failed to upload image')
    });
  }
}