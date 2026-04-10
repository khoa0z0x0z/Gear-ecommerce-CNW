import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminStats {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    topProducts: any[];
    revenueChart: any[];
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/orders`;

    getDashboardStats(): Observable<AdminStats> {
        return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
    }

    getAllOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/all`);
    }

    updateOrderStatus(orderId: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${orderId}/status`, JSON.stringify(status), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    getCustomers(): Observable<any[]> {
        // We'll implement this later in the UsersController, but point to it now
        return this.http.get<any[]>(`${environment.apiUrl}/users/customers`);
    }
}
