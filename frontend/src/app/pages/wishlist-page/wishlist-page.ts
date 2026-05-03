import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.css'
})
export class WishlistPage implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  wishlistItems = signal<any[]>([]);

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        if (res && res.items) {
          this.wishlistItems.set(res.items);
        }
      },
      error: (err) => console.error('Error loading wishlist', err)
    });
  }

  removeFromWishlist(productId: number) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistItems.update(items => items.filter(i => i.productId !== productId));
      }
    });
  }

  addToCart(item: any) {
    const productForCart: any = {
      id: item.productId,
      name: item.productName,
      price: item.productPrice,
      image: item.productImage,
      description: ''
    };
    this.cartService.addToCart(productForCart);
    alert('Added to cart!');
    this.removeFromWishlist(item.productId);
  }

  moveAllToCart() {
    const items = this.wishlistItems();
    if (items.length === 0) return;

    items.forEach(item => {
      const productForCart: any = {
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        image: item.productImage,
        description: ''
      };
      this.cartService.addToCart(productForCart);
      this.wishlistService.removeFromWishlist(item.productId).subscribe();
    });

    this.wishlistItems.set([]);
    alert('All items moved to cart!');
  }
}
