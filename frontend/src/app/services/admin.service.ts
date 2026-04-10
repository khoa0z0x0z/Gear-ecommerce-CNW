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
        return this.http.get<any[]>(`${environment.apiUrl}/users/customers`);
    }

    getCustomerDetails(id: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/users/${id}/details`);
    }

    toggleCustomerStatus(id: number): Observable<any> {
        return this.http.put(`${environment.apiUrl}/users/${id}/toggle-status`, {});
    }

    resetCustomerPassword(id: number, newPassword: string): Observable<any> {
        return this.http.put(`${environment.apiUrl}/users/${id}/reset-password`, JSON.stringify(newPassword), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    getRevenueStats(type: string = 'month', year?: number): Observable<any[]> {
        let url = `${this.apiUrl}/revenue-stats?type=${type}`;
        if (year) url += `&year=${year}`;
        return this.http.get<any[]>(url);
    }

    getSettings(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/settings`);
    }

    saveSettings(settings: any[]): Observable<any> {
        return this.http.put(`${environment.apiUrl}/settings`, settings);
    }
}
