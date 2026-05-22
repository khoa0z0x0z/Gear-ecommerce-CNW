import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private categoryService = inject(CategoryService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);

  bestSellingProducts = signal<any[]>([]);
  exploreProducts = signal<any[]>([]);
  categories = signal<any[]>([]);
  heroProducts = signal<any[]>([]);

  // Sliding categories logic
  categoryPageIndex = signal(0);
  itemsPerPage = 6;

  visibleCategories = computed(() => {
    const all = this.categories();
    const start = this.categoryPageIndex() * this.itemsPerPage;
    return all.slice(start, start + this.itemsPerPage);
  });

  nextCategories() {
    const maxPage = Math.ceil(this.categories().length / this.itemsPerPage) - 1;
    if (this.categoryPageIndex() < maxPage) {
      this.categoryPageIndex.set(this.categoryPageIndex() + 1);
    }
  }

  prevCategories() {
    if (this.categoryPageIndex() > 0) {
      this.categoryPageIndex.set(this.categoryPageIndex() - 1);
    }
  }

  // Method to add items to cart from the homepage
  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert(`Added ${product.name} to cart!`);
  }

  toggleWishlist(product: any) {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      alert('Please login to use wishlist');
      this.router.navigate(['/login']);
      return;
    }

    this.wishlistService.addToWishlist(product.id).subscribe({
      next: () => alert(`Added ${product.name} to wishlist!`),
      error: (err) => {
        console.error('Wishlist error:', err);
        alert('Failed to add to wishlist: ' + (err.error?.message || 'Please try again later'));
      }
    });
  }

  currentSlideIndex = 0;
  autoPlayInterval: any;

  ngOnInit() {
    const role = localStorage.getItem('role');
    if (role === 'Admin') {
      this.router.navigate(['/admin']);
      return;
    }
    this.startAutoPlay();
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (products) => {
        const mapped = products.map((p: any) => {
          const image = p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : 'https://via.placeholder.com/300';
          // Prefer explicit averageRating/ratingCount from API. If missing, try to compute from totalStars/ratingCount.
          const avgNum = p.averageRating != null
            ? Number(p.averageRating)
            : (p.totalStars && p.ratingCount ? Number(p.totalStars) / Number(p.ratingCount) : 0);
          const avg = (Number.isFinite(avgNum) ? avgNum : 0).toFixed(1);
          const count = p.ratingCount || 0;
          const ratingDisplay = `${avg} / 5 (${count} reviews)`;

          return {
            ...p,
            image,
            rating: ratingDisplay
          };
        });

        // Pick best selling from specific categories for Hero
        const categoriesForHero = ['Laptop', 'Điện thoại', 'Bàn phím cơ'];
        const heroItems: any[] = [];

        categoriesForHero.forEach(catName => {
          const topInCat = mapped
            .filter((p: any) => p.categoryName === catName)
            .sort((a: any, b: any) => (b.sold || 0) - (a.sold || 0))[0];

          if (topInCat) {
            heroItems.push({
              tag: topInCat.categoryName,
              title: topInCat.name,
              btnText: 'Buy Now →',
              image: topInCat.image,
              id: topInCat.id
            });
          }
        });

        this.heroProducts.set(heroItems);
        const best = mapped.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 4);
        const explore = mapped.slice(4, 12);
        this.bestSellingProducts.set(best);
        this.exploreProducts.set(explore);

        // Now fetch per-product reviews to ensure rating/count reflect actual reviews
        this.updateRatingsForProducts(this.bestSellingProducts);
        this.updateRatingsForProducts(this.exploreProducts);
      }
    });
  }

  // For each product in the provided signal list, fetch reviews and update rating/count
  updateRatingsForProducts(listSignal: any) {
    const list = listSignal() || [];
    list.forEach((prod: any) => {
      if (!prod || !prod.id) return;
      this.productService.getReviews(prod.id).subscribe({
        next: (reviews: any[]) => {
          const visible = (reviews || []).filter(r => r.isApproved !== false);
          const count = visible.length;
          const total = visible.reduce((s, r) => s + (r.rating || 0), 0);
          const avg = count > 0 ? total / count : 0;
          const ratingDisplay = `${avg.toFixed(1)} / 5 (${count} reviews)`;

          listSignal.update((arr: any[]) => arr.map(p => p.id === prod.id ? ({ ...p, averageRating: avg, ratingCount: count, rating: ratingDisplay }) : p));
        },
        error: (err) => {
          // ignore per-product errors silently
        }
      });
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (cats) => {
        this.categories.set(cats);
      }
    });
  }

  ngOnDestroy() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      const len = this.heroProducts().length;
      if (len > 0) {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % len;
      }
    }, 4000);
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }

  // Icons mapping for browse categories
  private categoryIcons: { [key: string]: string } = {
    'Bàn phím cơ': '⌨️',
    'Chuột Gaming': '🖱️',
    'Tai nghe': '🎧',
    'Laptop': '💻',
    'Điện thoại': '📱',
    'Lót chuột': '⬛',
    'Ghế Gaming': '💺'
  };

  getIcon(name: string): string {
    return this.categoryIcons[name] || '📦';
  }

  services = [
    {
      icon: '🚚',
      title: 'FAST & SECURE DELIVERY',
      desc: 'Free shipping for all orders over 2.000.000 VNĐ'
    },
    {
      icon: '🎧',
      title: '24/7 TECH SUPPORT',
      desc: 'Expert help for setup & troubleshooting'
    },
    {
      icon: '🛡️',
      title: 'OFFICIAL WARRANTY',
      desc: '100% authentic & 12-month warranty'
    }
  ];
}