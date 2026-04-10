import { Component, OnInit, inject, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
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

  // State
  product = signal<Product | null>(null);
  quantity = signal(1);
  selectedColor = signal('black');

  thumbnails = [
    { image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png' },
    { image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png' },
    { image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png' }
  ];

  selectedImage = signal(this.thumbnails[0]);

  relatedProducts = [
    { id: 101, name: 'HAVIT HV-G92 Gamepad', price: 120, oldPrice: 160, rating: '(88)', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png' },
    { id: 102, name: 'AK-900 Wired Keyboard', price: 960, oldPrice: 1160, rating: '(75)', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png' }
  ];

  ngOnInit() {
    // Get ID from URL and load product
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Mocking product load for now
    this.product.set({
      id: id || 1,
      name: 'RedThunder K10 Wired Gaming Keyboard and Mouse',
      price: 192,
      description: 'RedThunder K10 Wired Gaming Keyboard and Mouse and Wrist Rest Combo, RGB Backlit, Mechanical Feel Anti-ghosting Keyboard.',
      category: 'Gaming Gear',
      rating: '(150 Reviews)',
      image: this.thumbnails[0].image
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