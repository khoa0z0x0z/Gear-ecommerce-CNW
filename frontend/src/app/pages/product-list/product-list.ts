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
    },
    {
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
      name: 'Wireless Earbuds',
      price: '$100',
      oldPrice: '',
      rating: '(35)'
    },
    {
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
      name: 'CANON EOS DSLR Camera',
      price: '$360',
      oldPrice: '',
      rating: '(95)'
    },
    {
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
      name: 'ASUS FHD Gaming Laptop',
      price: '$700',
      oldPrice: '',
      rating: '(325)'
    },
    {
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
      name: 'Power Bank',
      price: '$500',
      oldPrice: '',
      rating: '(145)'
    }
  ];
}