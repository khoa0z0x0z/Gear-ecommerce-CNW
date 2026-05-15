import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

// Flag to prevent infinite refresh loops
let isRefreshing = false;

import { HttpBackend } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Inject HttpBackend at the top level (valid injection context)
  // Create a clean HttpClient that bypasses interceptors to avoid circular dependencies
  const httpBackend = inject(HttpBackend);
  const httpClient = new HttpClient(httpBackend);

  // Attach bearer token to every outgoing request
  const authReq = token ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only intercept 401 errors, and skip the refresh/login endpoints themselves
      const isAuthEndpoint = req.url.includes('/auth/refresh-token') || req.url.includes('/auth/login');
      if (error.status === 401 && !isAuthEndpoint) {
        return handleRefresh(req, next, httpClient);
      }
      return throwError(() => error);
    })
  );
};

function addToken(req: HttpRequest<unknown>, token: string) {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}

function handleRefresh(originalReq: HttpRequest<unknown>, next: HttpHandlerFn, http: HttpClient) {
  // Prevent parallel refresh calls if multiple requests fail at once
  if (isRefreshing) {
    // Simply fail — the retry after refresh will pick up once fresh token arrives
    return throwError(() => new Error('Refreshing in progress'));
  }

  isRefreshing = true;
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    isRefreshing = false;
    forceLogout();
    return throwError(() => new Error('No refresh token'));
  }

  const apiUrl = `${environment.apiUrl}/auth`;

  return http.post<any>(`${apiUrl}/refresh-token`, { refreshToken }).pipe(
    switchMap((res) => {
      isRefreshing = false;

      // Save the new tokens
      localStorage.setItem('token', res.token);
      if (res.refreshToken) {
        localStorage.setItem('refreshToken', res.refreshToken);
      }

      // Retry the original request with the fresh access token
      return next(addToken(originalReq, res.token));
    }),
    catchError((err) => {
      isRefreshing = false;
      // Refresh token itself is expired or invalid — force logout
      forceLogout();
      return throwError(() => err);
    })
  );
}

function forceLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  window.location.href = '/login';
}
