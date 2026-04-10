import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminStats as StatsData } from '../../services/admin.service';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule, AdminSidebar],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.css'
})
export class AdminStats implements OnInit {
  private adminService = inject(AdminService);
  stats = signal<StatsData | null>(null);

  ngOnInit() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error loading stats', err)
    });
  }

  getBarHeight(revenue: number): number {
    if (!this.stats() || this.stats()!.revenueChart.length === 0) return 0;
    const max = Math.max(...this.stats()!.revenueChart.map(x => x.revenue));
    return max > 0 ? (revenue / max) * 100 : 0;
  }
}
