import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css'
})
export class AboutPage {
  stats = [
    { icon: '🏪', value: '10.5k', label: 'Products Available', active: false },
    { icon: '💰', value: '33k', label: 'Monthly sales', active: true },
    { icon: '🛍️', value: '45.5k', label: 'Happy Customers', active: false },
    { icon: '💳', value: '25k', label: 'Annual revenue', active: false }
  ];

  services = [
    {
      icon: '🚚',
      title: 'FAST & SECURE DELIVERY',
      desc: 'Free shipping for all orders over 2.000.000 VNĐ'
    },
    {
      icon: '🎧',
      title: '24/7 TECH SUPPORT',
      desc: 'Expert help for setup & troubleshooting'
    },
    {
      icon: '🛡️',
      title: 'OFFICIAL WARRANTY',
      desc: '100% authentic & 12-month warranty'
    }
  ];
}