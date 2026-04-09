import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage implements OnInit, OnDestroy {
  currentSlideIndex = 0;
  autoPlayInterval: any;

  banners = [
    {
      tag: 'iPhone 16 Pro Max',
      title: 'Experience the \nFuture Today.',
      btnText: 'Buy Now →'
    },
    {
      tag: 'MacBook Pro M3',
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

  bestSellingProducts = [
    {
      badge: '💻',
      name: 'Laptop Lenovo Legion 7',
      price: '$260',
      oldPrice: '$360',
      rating: '(65)'
    },
    {
      badge: '📱',
      name: 'iPad 11 inch 2025',
      price: '$960',
      oldPrice: '$1160',
      rating: '(65)'
    },
    {
      badge: '📱',
      name: 'iPhone 16 Pro Max',
      price: '$160',
      oldPrice: '$170',
      rating: '(65)'
    },
    {
      badge: '📱',
      name: 'Galaxy Z Fold7',
      price: '$360',
      oldPrice: '',
      rating: '(65)'
    }
  ];

  exploreProducts = [
    {
      badge: '🎧',
      name: 'Wireless Earbuds',
      price: '$100',
      rating: '(35)'
    },
    {
      badge: '📷',
      name: 'CANON EOS DSLR Camera',
      price: '$360',
      rating: '(95)'
    },
    {
      badge: '💻',
      name: 'ASUS FHD Gaming Laptop',
      price: '$700',
      rating: '(325)'
    },
    {
      badge: '🔋',
      name: 'Power Bank',
      price: '$500',
      rating: '(145)'
    },
    {
      badge: '🚁',
      name: 'Drone',
      price: '$980',
      rating: '(65)'
    },
    {
      badge: '⌨️',
      name: 'Mechanical Keyboard',
      price: '$100',
      rating: '(55)'
    },
    {
      badge: '🎮',
      name: 'GP11 Shooter USB Gamepad',
      price: '$60',
      rating: '(65)'
    },
    {
      badge: '🖱️',
      name: 'Gaming Mouse',
      price: '$60',
      rating: '(55)'
    }
  ];

  services = [
    {
      icon: '🚚',
      title: 'FAST & SECURE DELIVERY',
      desc: 'Free shipping for all orders over $100'
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