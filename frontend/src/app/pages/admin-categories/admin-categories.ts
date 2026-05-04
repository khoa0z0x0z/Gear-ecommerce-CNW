import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css'
})
export class AdminCategories implements OnInit {
  private router = inject(Router);
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  editing: Category | null = null;

  form = {
    name: '',
    description: ''
  };

  ngOnInit() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) { this.router.navigate(['/login']); return; }
    this.load();
  }

  load() {
    this.categoryService.getAll().subscribe(data => this.categories.set(data));
  }

  edit(c: Category) {
    this.editing = c;
    this.form = { name: c.name || '', description: c.description || '' };
  }

  clear() {
    this.editing = null;
    this.form = { name: '', description: '' };
  }

  submit() {
    if (!this.form.name) {
      alert('Tên danh mục là bắt buộc');
      return;
    }

    if (this.editing?.id) {
      this.categoryService.update(this.editing.id, this.form).subscribe({
        next: () => { alert('Cập nhật thành công'); this.load(); this.clear(); },
        error: (err) => alert('Lỗi khi cập nhật: ' + (err.error?.message || ''))
      });
    } else {
      this.categoryService.create(this.form).subscribe({
        next: () => { alert('Thêm mới thành công'); this.load(); this.clear(); },
        error: (err) => alert('Lỗi khi thêm mới: ' + (err.error?.message || ''))
      });
    }
  }

  remove(id?: number) {
    if (!id) return;
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    this.categoryService.delete(id).subscribe({
      next: () => { alert('Xóa thành công'); this.load(); },
      error: (err) => alert('Không thể xóa: ' + (err.error?.message || 'Đã có lỗi xảy ra'))
    });
  }
}
