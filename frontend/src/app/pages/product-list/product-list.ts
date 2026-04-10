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
    // For now, using mock data that follows the new model
    this.allProducts.set([
      {
        id: 1,
        name: 'Laptop Lenovo Legion 7',
        price: 260,
        oldPrice: 360,
        rating: '(65)',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
        category: 'Laptops',
        description: 'High-performance gaming laptop.'
      },
      {
        id: 2,
        name: 'ASUS ROG Strix G16',
        price: 700,
        rating: '(325)',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
        category: 'Laptops',
        description: 'Unleash your gaming potential.'
      },
      {
        id: 3,
        name: 'MSI GeForce RTX 4090',
        price: 1600,
        oldPrice: 1800,
        rating: '(120)',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
        category: 'Components',
        description: 'The ultimate GPU performance.'
      },
      {
        id: 4,
        name: 'Razer BlackWidow V4',
        price: 180,
        rating: '(45)',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_47.png',
        category: 'Gaming Gear',
        description: 'Mechanical gaming keyboard with RGB.'
      }
    ]);
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