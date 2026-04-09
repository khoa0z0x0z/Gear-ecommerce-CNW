import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  allProducts = [
    { badge: '💻', name: 'Laptop Lenovo Legion 7', price: '$260', oldPrice: '$360', rating: '(65)' },
    { badge: '📱', name: 'iPad 11 inch 2025', price: '$960', oldPrice: '$1160', rating: '(65)' },
    { badge: '📱', name: 'iPhone 16 Pro Max', price: '$160', oldPrice: '$170', rating: '(65)' },
    { badge: '📱', name: 'Galaxy Z Fold7', price: '$360', oldPrice: '', rating: '(65)' },
    { badge: '🎧', name: 'Wireless Earbuds', price: '$100', oldPrice: '', rating: '(35)' },
    { badge: '📷', name: 'CANON EOS DSLR Camera', price: '$360', oldPrice: '', rating: '(95)' },
    { badge: '💻', name: 'ASUS FHD Gaming Laptop', price: '$700', oldPrice: '', rating: '(325)' },
    { badge: '🔋', name: 'Power Bank', price: '$500', oldPrice: '', rating: '(145)' }
  ];
}