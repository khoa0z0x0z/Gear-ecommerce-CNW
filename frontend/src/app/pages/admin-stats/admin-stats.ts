import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminStats as StatsData } from '../../services/admin.service';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule, AdminSidebar, FormsModule],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.css'
})
export class AdminStats implements OnInit {
  private adminService = inject(AdminService);
  stats = signal<StatsData | null>(null);

  viewType = signal<'month' | 'year'>('month');
  selectedYear = signal<number>(new Date().getFullYear());
  customRevenueChart = signal<any[]>([]);
  availableYears: number[] = [];

  ngOnInit() {
    this.initYears();
    this.loadGeneralStats();
    this.loadRevenueChart();
  }

  initYears() {
    const start = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(start - i);
    }
  }

  loadGeneralStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error loading stats', err)
    });
  }

  loadRevenueChart() {
    this.adminService.getRevenueStats(this.viewType(), this.selectedYear()).subscribe({
      next: (data) => this.customRevenueChart.set(data),
      error: (err) => console.error('Error loading revenue stats', err)
    });
  }

  onViewTypeChange(type: 'month' | 'year') {
    this.viewType.set(type);
    this.loadRevenueChart();
  }

  onYearChange() {
    this.loadRevenueChart();
  }

  getBarHeight(revenue: number): number {
    const data = this.customRevenueChart();
    if (data.length === 0) return 0;
    const max = Math.max(...data.map(x => x.revenue));
    return max > 0 ? (revenue / max) * 100 : 0;
  }
}
