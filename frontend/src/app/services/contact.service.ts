import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/contacts`;

    sendMessage(data: { name: string, email: string, phone: string, message: string }) {
        return this.http.post(this.apiUrl, data);
    }
}
