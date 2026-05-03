import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';
import { Review, ReviewUpsert } from '../../models/review.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);

  // State
  product = signal<Product | null>(null);
  quantity = signal(1);
  selectedColor = signal('black');
  thumbnails = signal<{ image: string }[]>([]);
  selectedImage = signal<{ image: string }>({ image: '' });

  relatedProducts = signal<any[]>([]);
  reviews = signal<Review[]>([]);
  userReview = signal<Review | null>(null);
  newRating = signal(5);
  newComment = signal('');
  editingId = signal<number | null>(null);
  editRating = signal(5);
  editComment = signal('');

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
        this.loadReviews(id);
      },
      error: (err) => {
        console.error('Error loading product:', err);
      }
    });
  }

  loadReviews(productId: number) {
    this.productService.getReviews(productId).subscribe({
      next: (r) => {
        this.reviews.set(r);
        const uid = Number(localStorage.getItem('userId')) || 0;
        const found = r.find(x => x.userId === uid);
        this.userReview.set(found ?? null);
      },
      error: (err) => console.error('Failed to load reviews', err)
    });
  }

  getAvatarForReview(r: Review) {
    const currentUserId = Number(localStorage.getItem('userId')) || 0;
    const localAvatar = localStorage.getItem('avatarUrl');
    if (r.userId === currentUserId && localAvatar) return localAvatar;
    return r.userAvatarUrl || 'https://via.placeholder.com/40';
  }

  canManageReview(review: Review) {
    const role = localStorage.getItem('role') || '';
    const userId = Number(localStorage.getItem('userId')) || 0;
    return role === 'Admin' || review.userId === userId;
  }

  addReview() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      alert('Please login to comment');
      return;
    }
    const prod = this.product();
    if (!prod) return;
    if (this.userReview()) {
      alert('Bạn chỉ được đánh giá 1 lần cho sản phẩm này.');
      return;
    }
    const dto: ReviewUpsert = { productId: prod.id, rating: this.newRating(), comment: this.newComment() };
    this.productService.addReview(dto).subscribe({
      next: (r) => {
        this.reviews.update(list => [r, ...list]);
        this.newComment.set('');
        this.newRating.set(5);
        this.userReview.set(r);
      },
      error: (err) => {
        if (err?.status === 409) {
          alert(err.error?.message || 'Bạn đã đánh giá sản phẩm này trước đó.');
        } else {
          console.error('Add review failed', err);
        }
      }
    });
  }

  startEdit(review: Review) {
    this.editingId.set(review.id);
    this.editRating.set(review.rating);
    this.editComment.set(review.comment || '');
  }

  saveEdit(review: Review) {
    const dto: ReviewUpsert = { productId: review.productId, rating: this.editRating(), comment: this.editComment() };
    this.productService.updateReview(review.id, dto).subscribe({
      next: () => {
        this.reviews.update(list => list.map(r => r.id === review.id ? { ...r, rating: dto.rating, comment: dto.comment } : r));
        this.editingId.set(null);
      },
      error: (err) => console.error('Update review failed', err)
    });
  }

  deleteReview(review: Review) {
    if (!confirm('Delete this review?')) return;
    this.productService.deleteReview(review.id).subscribe({
      next: () => this.reviews.update(list => list.filter(r => r.id !== review.id)),
      error: (err) => console.error('Delete failed', err)
    });
  }

  toggleHide(review: Review) {
    const newVal = !review.isApproved;
    this.productService.setReviewApproval(review.id, newVal).subscribe({
      next: () => this.reviews.update(list => list.map(r => r.id === review.id ? { ...r, isApproved: newVal } : r)),
      error: (err) => console.error('Toggle hide failed', err)
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

  toggleWishlist(prod?: Product | any) {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      alert('Please login to use wishlist');
      this.router.navigate(['/login']);
      return;
    }

    const p = prod || this.product();
    if (p) {
      this.wishlistService.addToWishlist(p.id).subscribe({
        next: () => alert(`Added ${p.name} to wishlist!`),
        error: (err) => {
          console.error('Wishlist error:', err);
          alert('Failed to add to wishlist: ' + (err.error?.message || 'Please try again later'));
        }
      });
    }
  }
}