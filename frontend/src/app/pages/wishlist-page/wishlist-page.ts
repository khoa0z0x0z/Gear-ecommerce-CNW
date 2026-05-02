import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService, WishlistItem } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { UserSidebar } from '../../components/user-sidebar/user-sidebar';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, RouterLink, UserSidebar],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.css'
})
export class WishlistPage implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  wishlistItems = signal<WishlistItem[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.isLoading.set(true);
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlistItems.set(res.items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  removeItem(productId: number) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => this.loadWishlist(),
      error: (err) => console.error(err)
    });
  }

  addToCart(item: WishlistItem) {
    // Assuming cartService has an addToCart method that takes a simple product-like object
    this.cartService.addToCart({
      id: item.productId,
      name: item.productName,
      price: item.price,
      image: item.imageUrl || 'https://via.placeholder.com/300'
    } as any);
    
    // Optionally remove from wishlist after adding to cart
    // this.removeItem(item.productId);
  }
}
