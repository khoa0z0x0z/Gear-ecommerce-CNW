import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  categories = [
    { name: 'Phones', icon: '📱' },
    { name: 'Computers', icon: '🖥️' },
    { name: 'SmartWatches', icon: '⌚' },
    { name: 'Camera', icon: '📷' },
    { name: 'HeadPhones', icon: '🎧' },
    { name: 'Gaming', icon: '🎮' }
  ];

  bestSellingProducts = [
    { id: 1, name: 'Laptop Lenovo Legion', price: 260, oldPrice: 360, image: 'https://via.placeholder.com/160x140' },
    { id: 2, name: 'iPad 11 inch 2025', price: 980, oldPrice: 1160, image: 'https://via.placeholder.com/160x140' },
    { id: 3, name: 'iPhone 16 Pro Max', price: 160, oldPrice: 170, image: 'https://via.placeholder.com/160x140' },
    { id: 4, name: 'Galaxy Z Fold7', price: 360, oldPrice: 0, image: 'https://via.placeholder.com/160x140' }
  ];

  exploreProducts = [
    { id: 1, name: 'Wireless Earbuds', price: 100, image: 'https://via.placeholder.com/180x150' },
    { id: 2, name: 'Canon EOS DSLR Camera', price: 360, image: 'https://via.placeholder.com/180x150' },
    { id: 3, name: 'ASUS Laptop', price: 700, image: 'https://via.placeholder.com/180x150' },
    { id: 4, name: 'Power Bank', price: 500, image: 'https://via.placeholder.com/180x150' },
    { id: 5, name: 'Drone', price: 980, image: 'https://via.placeholder.com/180x150' },
    { id: 6, name: 'Mechanical Keyboard', price: 160, image: 'https://via.placeholder.com/180x150' },
    { id: 7, name: 'Gamepad', price: 66, image: 'https://via.placeholder.com/180x150' },
    { id: 8, name: 'Gaming Mouse', price: 60, image: 'https://via.placeholder.com/180x150' }
  ];
}