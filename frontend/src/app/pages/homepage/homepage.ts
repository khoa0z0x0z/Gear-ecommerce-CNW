import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

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
        const mapped = products.map((p: any) => ({
          ...p,
          image: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : 'https://via.placeholder.com/300',
          rating: '(65)' // Mock rating for now
        }));

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
              title: topInCat.name + '\n' + topInCat.description,
              btnText: 'Buy Now →',
              image: topInCat.image,
              id: topInCat.id
            });
          }
        });

        this.heroProducts.set(heroItems);
        this.bestSellingProducts.set(mapped.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 4));
        this.exploreProducts.set(mapped.slice(4, 12));
      }
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