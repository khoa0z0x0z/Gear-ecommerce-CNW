import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecommendedProduct {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    shortSpecs: string;
}

export interface ChatResponse {
    aiMessage: string;
    recommendedProducts: RecommendedProduct[];
}

@Injectable({
    providedIn: 'root'
})
export class ChatbotService {
    private apiUrl = 'https://localhost:7057/api/chatbot/message';

    constructor(private http: HttpClient) { }

    sendMessage(message: string, sessionId?: string): Observable<ChatResponse> {
        const payload = {
            message: message,
            sessionId: sessionId || ''
        };
        return this.http.post<ChatResponse>(this.apiUrl, payload);
    }
}
