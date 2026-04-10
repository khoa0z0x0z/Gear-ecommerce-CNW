import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  bestSellingProducts = signal<any[]>([]);
  exploreProducts = signal<any[]>([]);

  // Method to add items to cart from the homepage
  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert(`Added ${product.name} to cart!`);
  }

  currentSlideIndex = 0;
  autoPlayInterval: any;

  banners = [
    {
      tag: 'iPhone 16 Pro Max',
      title: 'Experience the \nFuture Today.',
      btnText: 'Buy Now →'
    },
    {
      tag: 'MacBook Pro M3 Max',
      title: 'Power Meets \nPortability.',
      btnText: 'Shop Laptops →'
    },
    {
      tag: 'Sony WH-1000XM5',
      title: 'Immersive Audio \nEverywhere.',
      btnText: 'Discover More →'
    }
  ];

  ngOnInit() {
    this.startAutoPlay();
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (products) => {
        const mapped = products.map(p => ({
          ...p,
          image: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : 'https://via.placeholder.com/300',
          rating: '(65)' // Mock rating for now
        }));
        this.bestSellingProducts.set(mapped.slice(0, 4));
        this.exploreProducts.set(mapped.slice(4, 12));
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
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.banners.length;
    }, 3000);
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }

  heroCategories = [
    'Laptops & PC',
    'Smartphones',
    'Tablets & iPods',
    'Audio & Headphones',
    'Cameras & Photography',
    'Smart Watches',
    'Gaming Gear',
    'Accessories',
    'Monitors & TV'
  ];

  browseCategories = [
    { icon: '📱', name: 'Phones' },
    { icon: '🖥️', name: 'Computers' },
    { icon: '⌚', name: 'SmartWatches' },
    { icon: '📷', name: 'Camera' },
    { icon: '🎧', name: 'HeadPhones' },
    { icon: '🎮', name: 'Gaming' }
  ];

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