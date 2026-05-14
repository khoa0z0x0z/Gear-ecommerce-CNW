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
  };

  // Multi-image list
  imageUrls = signal<string[]>([]);
  newUrlInput = '';
  uploadingIndex: number | null = null;

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
        };

        // Load existing image URLs
        if (p.imageUrls && p.imageUrls.length > 0) {
          this.imageUrls.set([...p.imageUrls]);
        }
      }
    });
  }

  // Add URL manually
  addUrl() {
    const url = this.newUrlInput.trim();
    if (!url) return;
    this.imageUrls.update(list => [...list, url]);
    this.newUrlInput = '';
  }

  // Remove image at index
  removeImage(index: number) {
    this.imageUrls.update(list => list.filter((_, i) => i !== index));
  }

  // Upload file from disk
  onFileSelected(event: any) {
    const file: File = event?.target?.files?.[0];
    if (!file) return;

    this.uploadingIndex = this.imageUrls().length;

    this.productService.uploadImage(file).subscribe({
      next: (res: any) => {
        this.imageUrls.update(list => [...list, res.url]);
        this.uploadingIndex = null;
        // Reset file input so same file can be re-selected
        event.target.value = '';
      },
      error: () => {
        alert('Failed to upload image. Please try again.');
        this.uploadingIndex = null;
      }
    });
  }

  submit() {
    const payload = {
      ...this.product,
      price: +this.product.price,
      imageUrls: this.imageUrls()
    };

    if (this.productId) {
      this.productService.update(this.productId, payload).subscribe({
        next: () => {
          alert('Cập nhật sản phẩm thành công!');
          this.router.navigate(['/admin']);
        },
        error: () => alert('Lỗi khi cập nhật sản phẩm')
      });
    } else {
      this.productService.create(payload).subscribe({
        next: () => {
          alert('Thêm sản phẩm thành công!');
          this.router.navigate(['/admin']);
        },
        error: () => alert('Lỗi khi thêm sản phẩm')
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin']);
  }
}