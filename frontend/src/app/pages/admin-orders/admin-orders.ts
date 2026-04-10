import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, AdminSidebar, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrders implements OnInit {
  private adminService = inject(AdminService);
  orders = signal<any[]>([]);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getAllOrders().subscribe({
      next: (data) => this.orders.set(data),
      error: (err) => console.error('Error loading orders', err)
    });
  }

  updateStatus(orderId: number, status: string) {
    this.adminService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        alert('Order status updated!');
        this.loadOrders();
      },
      error: (err) => alert('Failed to update status')
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
}
