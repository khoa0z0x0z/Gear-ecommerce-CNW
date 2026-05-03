import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuditEntry {
    TimestampUtc: string;
    AdminId: number;
    AdminEmail: string;
    Action: string;
    Resource: string;
    ResourceId: number;
    Before?: any;
    After?: any;
}

@Injectable({ providedIn: 'root' })
export class AuditService {
    private http = inject(HttpClient);

    getLogs(lines: number = 200): Observable<AuditEntry[]> {
        return this.http.get<AuditEntry[]>(`${environment.apiUrl}/audit/logs?lines=${lines}`);
    }
}
