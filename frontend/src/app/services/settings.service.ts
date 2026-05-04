import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

export interface Setting {
  key: string;
  value: string;
  group: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/settings`;

  // Signals for global state
  settings = signal<Setting[]>([]);

  fetchPublicSettings() {
    return this.http.get<Setting[]>(`${this.apiUrl}/public`).pipe(
      tap(data => this.settings.set(data))
    );
  }

  getSetting(key: string): string | undefined {
    return this.settings().find(s => s.key === key)?.value;
  }

  // Admin methods
  getAll() {
    return this.http.get<Setting[]>(this.apiUrl);
  }

  updateRange(settings: Setting[]) {
    return this.http.put(`${this.apiUrl}`, settings);
  }
}
