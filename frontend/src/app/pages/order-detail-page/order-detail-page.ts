import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail-page.html',
  styleUrl: './order-detail-page.css'
})
export class OrderDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private router = inject(Router);

  order = signal<any>(null);
  isLoading = signal(true);

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      this.router.navigate(['/login']);
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadOrderDetail(id);
    }
  }

  loadOrderDetail(id: number) {
    this.orderService.getOrderById(id).subscribe({
      next: (data) => {
        this.order.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading order detail', err);
        this.isLoading.set(false);
      }
    });
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  // Sum of (price × qty) for each order item
  itemsSubtotal(): number {
    const o = this.order();
    if (!o?.orderDetails) return 0;
    return o.orderDetails.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  }

  // Shipping fee stored in the order
  shippingFee(): number {
    return this.order()?.shippingFee ?? 0;
  }

  // Discount = itemsSubtotal + shipping - totalAmount
  discountAmount(): number {
    const o = this.order();
    if (!o) return 0;
    const computed = this.itemsSubtotal() + this.shippingFee() - o.totalAmount;
    return computed > 0 ? computed : 0;
  }
}
