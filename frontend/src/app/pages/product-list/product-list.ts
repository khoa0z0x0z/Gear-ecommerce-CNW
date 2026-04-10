import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // State signals
  allProducts = signal<Product[]>([]);
  selectedCategory = signal<string>('All');
  selectedBrand = signal<string>('All');
  sortBy = signal<string>('newest');

  // Filtered and sorted products
  filteredProducts = computed(() => {
    let products = this.allProducts();

    // Filter by Category
    if (this.selectedCategory() !== 'All') {
      products = products.filter(p => p.category === this.selectedCategory());
    }

    // Filter by Brand (Assuming Brand is part of the name or we add it to the model)
    if (this.selectedBrand() !== 'All') {
      products = products.filter(p => p.name.toLowerCase().includes(this.selectedBrand().toLowerCase()));
    }

    // Sort
    if (this.sortBy() === 'priceLow') {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy() === 'priceHigh') {
      products.sort((a, b) => b.price - a.price);
    }

    return products;
  });

  categories = ['All', 'Laptops', 'PC', 'Components', 'Gaming Gear', 'Accessories'];
  brands = ['All', 'ASUS', 'MSI', 'Lenovo', 'Logitech', 'Razer'];

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (products) => {
        // Map backend imageUrls to frontend image if needed
        const mappedProducts = products.map(p => ({
          ...p,
          image: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : 'https://via.placeholder.com/300',
          category: p.categoryName || p.category
        }));
        this.allProducts.set(mappedProducts);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  setBrand(brand: string) {
    this.selectedBrand.set(brand);
  }

  setSort(sort: string) {
    this.sortBy.set(sort);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(`Added ${product.name} to cart!`);
  }
}