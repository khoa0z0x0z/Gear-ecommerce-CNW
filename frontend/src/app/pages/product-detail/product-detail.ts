import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private productService = inject(ProductService);

  // State
  product = signal<Product | null>(null);
  quantity = signal(1);
  selectedColor = signal('black');
  thumbnails = signal<{ image: string }[]>([]);
  selectedImage = signal<{ image: string }>({ image: '' });

  relatedProducts = signal<any[]>([]);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: number) {
    this.productService.getById(id).subscribe({
      next: (p) => {
        this.product.set(p);

        // Map images
        if (p.imageUrls && p.imageUrls.length > 0) {
          const thumbs = p.imageUrls.map(url => ({ image: url }));
          this.thumbnails.set(thumbs);
          this.selectedImage.set(thumbs[0]);
        } else {
          const defaultImg = { image: 'https://via.placeholder.com/500' };
          this.thumbnails.set([defaultImg]);
          this.selectedImage.set(defaultImg);
        }

        // Mock related for now, or fetch by category
        this.loadRelatedProducts(p.categoryName || '');
      },
      error: (err) => {
        console.error('Error loading product:', err);
      }
    });
  }

  loadRelatedProducts(category: string) {
    this.productService.getAll().subscribe(all => {
      const related = all
        .filter(p => p.categoryName === category && p.id !== this.product()?.id)
        .slice(0, 4)
        .map(p => ({
          ...p,
          image: p.imageUrls?.[0] || 'https://via.placeholder.com/300',
          rating: '(88)'
        }));
      this.relatedProducts.set(related);
    });
  }

  selectImage(item: { image: string }) {
    this.selectedImage.set(item);
  }

  increaseQty() {
    this.quantity.update(q => q + 1);
  }

  decreaseQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  setColor(color: string) {
    this.selectedColor.set(color);
  }

  addToCart() {
    const prod = this.product();
    if (prod) {
      this.cartService.addToCart(prod, this.quantity());
      alert(`🎉 Đã thêm ${this.quantity()} chiếc ${prod.name} (Màu: ${this.selectedColor()}) vào giỏ hàng thành công!`);
    }
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/cart']);
  }
}