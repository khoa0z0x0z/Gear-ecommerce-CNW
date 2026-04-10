import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  
  // Method to add items to cart from the homepage
  addToCart(product: any) {
    // Basic mapping: handle price as number (remove $)
    const priceNum = typeof product.price === 'string' 
      ? parseFloat(product.price.replace('$', '')) 
      : product.price;

    this.cartService.addToCart({
      id: Math.random(), // For mockup, real products will have IDs
      name: product.name,
      price: priceNum,
      image: product.image,
      description: 'Mock product description',
      category: 'Electronics',
      rating: product.rating
    });
    
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
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
    name: 'Laptop Lenovo Legion 7',
    price: '$260',
    oldPrice: '$360',
    rating: '(65)'
  },
  {
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
    name: 'iPad 11 inch 2025',
    price: '$960',
    oldPrice: '$1160',
    rating: '(65)'
  },
  {
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
    name: 'iPhone 16 Pro Max',
    price: '$160',
    oldPrice: '$170',
    rating: '(65)'
  },
  {
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
    name: 'Galaxy Z Fold7',
    price: '$360',
    oldPrice: '',
    rating: '(65)'
  }
];

exploreProducts = [
  {
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
    name: 'Wireless Earbuds',
    price: '$100',
    rating: '(35)'
  },
  {
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
    name: 'CANON EOS DSLR Camera',
    price: '$360',
    rating: '(95)'
  },
  {
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
    name: 'ASUS FHD Gaming Laptop',
    price: '$700',
    rating: '(325)'
  },
  {
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
    name: 'Power Bank',
    price: '$500',
    rating: '(145)'
  },
  {
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
    name: 'Drone',
    price: '$980',
    rating: '(65)'
  },
  {
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
    name: 'Mechanical Keyboard',
    price: '$100',
    rating: '(55)'
  },
  {
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
    name: 'GP11 Shooter USB Gamepad',
    price: '$60',
    rating: '(65)'
  },
  {
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
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