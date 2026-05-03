import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
    selector: 'app-orders-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './orders-page.html',
    styleUrl: './orders-page.css'
})
export class OrdersPage implements OnInit {
    private orderService = inject(OrderService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    orders = signal<any[]>([]);
    isLoading = signal(true);
    expandedOrderId = signal<number | null>(null);
    vnpayStatus = signal<'success' | 'failed' | null>(null);

    ngOnInit() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.router.navigate(['/login']);
            return;
        }
        // Read VNPay return status from query params
        const status = this.route.snapshot.queryParamMap.get('vnp_status');
        if (status === 'success') this.vnpayStatus.set('success');
        else if (status === 'failed' || status === 'invalid') this.vnpayStatus.set('failed');
        this.loadOrders();
    }

    loadOrders() {
        this.isLoading.set(true);
        this.orderService.getMyOrders().subscribe({
            next: (data) => {
                this.orders.set(data);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    toggleOrder(id: number) {
        this.expandedOrderId.set(this.expandedOrderId() === id ? null : id);
    }

    getStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'pending': return 'status-pending';
            case 'confirmed': return 'status-confirmed';
            case 'shipping': return 'status-shipping';
            case 'delivered': return 'status-delivered';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-pending';
        }
    }

    getStatusLabel(status: string): string {
        switch (status?.toLowerCase()) {
            case 'pending': return '⏳ Chờ xác nhận';
            case 'confirmed': return '✅ Đã xác nhận';
            case 'shipping': return '🚚 Đang giao';
            case 'delivered': return '🎉 Đã giao';
            case 'cancelled': return '❌ Đã hủy';
            default: return status;
        }
    }
}
