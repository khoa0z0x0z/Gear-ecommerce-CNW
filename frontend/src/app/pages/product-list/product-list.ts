import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
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
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);

  // State signals
  allProducts = signal<Product[]>([]);
  selectedCategory = signal<string>('All');
  selectedBrand = signal<string>('All');
  sortBy = signal<string>('newest');

  categoriesList = signal<string[]>(['All']);
  brandsList = ['All', 'ASUS', 'MSI', 'Lenovo', 'Logitech', 'Razer', 'Keychron', 'Akko', 'HyperX'];

  filteredProducts = computed(() => {
    let products = [...this.allProducts()];

    if (this.selectedCategory() !== 'All') {
      products = products.filter(p => p.categoryName === this.selectedCategory());
    }
    // ... rest same

    // Filter by Brand
    if (this.selectedBrand() !== 'All') {
      products = products.filter(p =>
        p.name.toLowerCase().includes(this.selectedBrand().toLowerCase())
      );
    }

    // Sort
    if (this.sortBy() === 'priceLow') {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy() === 'priceHigh') {
      products.sort((a, b) => b.price - a.price);
    } else {
      products.sort((a, b) => b.id - a.id);
    }

    return products;
  });

  categories = ['All', 'Laptops', 'PC', 'Components', 'Gaming Gear', 'Accessories'];
  brands = ['All', 'ASUS', 'MSI', 'Lenovo', 'Logitech', 'Razer'];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
    });

    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (products) => {
        const mappedProducts = products.map(p => ({
          ...p,
          image: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : 'https://via.placeholder.com/300',
          category: p.categoryName || p.category
        }));
        this.allProducts.set(mappedProducts);
      }
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (cats) => {
        const names = cats.map(c => c.name);
        this.categoriesList.set(['All', ...names]);
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