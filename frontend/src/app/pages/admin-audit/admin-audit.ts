import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { AuditService, AuditEntry } from '../../services/audit.service';

@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [CommonModule, AdminSidebar],
  templateUrl: './admin-audit.html',
  styleUrl: './admin-audit.css'
})
export class AdminAudit implements OnInit {
  private router = inject(Router);
  private svc = inject(AuditService);
  entries: AuditEntry[] = [];
  query = '';
  actionFilter = 'all';

  get filtered(): AuditEntry[] {
    const q = this.query;
    const af = this.actionFilter;
    const arr = [...(this.entries || [])];
    arr.reverse(); // newest first
    return arr.filter(e => {
      if (af !== 'all' && e.Action !== af) return false;
      if (!q) return true;
      const qq = q.toLowerCase();
      return (e.AdminEmail || '').toLowerCase().includes(qq)
        || (e.Action || '').toLowerCase().includes(qq)
        || (e.Resource || '').toLowerCase().includes(qq)
        || ('' + e.ResourceId).includes(qq);
    });
  }

  ngOnInit() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) { this.router.navigate(['/login']); return; }
    this.load();
  }

  load() {
    this.svc.getLogs(1000).subscribe({ next: (r) => this.entries = (r || []), error: () => alert('Không thể tải log') });
  }

  onQuery(value: string) { this.query = value || ''; }
  onSetAction(value: string) { this.actionFilter = value || 'all'; }
}
