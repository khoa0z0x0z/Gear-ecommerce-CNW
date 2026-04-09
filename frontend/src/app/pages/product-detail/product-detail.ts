import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail {

  constructor(private router: Router) {}

  quantity = 1;

  thumbnails = [
    {
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png'
    },
    {
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png'
    },
    {
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png'
    },
    {
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png'
    }
  ];

  selectedImage = this.thumbnails[0];

  relatedProducts = [
    {
      badge: '-40%',
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
      name: 'HAVIT HV-G92 Gamepad',
      price: '$120',
      oldPrice: '$160',
      rating: '(88)'
    },
    {
      badge: '-35%',
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
      name: 'AK-900 Wired Keyboard',
      price: '$960',
      oldPrice: '$1160',
      rating: '(75)'
    },
    {
      badge: '-30%',
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
      name: 'IPS LCD Gaming Monitor',
      price: '$370',
      oldPrice: '$400',
      rating: '(99)'
    },
    {
      badge: '',
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
      name: 'RGB liquid CPU Cooler',
      price: '$160',
      oldPrice: '$170',
      rating: '(65)'
    }
  ];

  selectImage(item: { image: string }) {
    this.selectedImage = item;
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập tài khoản trước khi mua hàng bạn nhé!');
      this.router.navigate(['/login']);
      return;
    }

    alert(`🎉 Đã thêm ${this.quantity} chiếc RedThunder K10 vào giỏ hàng thành công!`);

    const newItem = {
      id: 1,
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
      name: 'RedThunder K10 Wired Gaming Keyboard',
      price: 192,
      quantity: this.quantity
    };

    localStorage.setItem('kat_cart', JSON.stringify([newItem]));

    this.router.navigate(['/cart']);
  }
}