import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, switchMap, tap } from 'rxjs';

interface LoginResponse {
  message: string;
  token: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';
  private roleKey = 'userRole';
  private userIdKey = 'userId';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<void> {
    return this.http.post<LoginResponse>('http://localhost:7108/api/v1/Auth/login', { email, password }).pipe(
      switchMap(response => {
        localStorage.setItem(this.tokenKey, response.token);

        const userId = this.getUserIdFromToken(response.token);
        if (!userId) return of(void 0);

        localStorage.setItem(this.userIdKey, userId);

        return this.getUser(userId).pipe(
          tap(user => {
            localStorage.setItem(this.roleKey, user.role);
          }),
          switchMap(() => of(void 0))
        );
      })
    );
  }

  getUser(userId: string): Observable<UserResponse> {
    const token = this.getToken();
    if (!token) throw new Error('Token yok');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<UserResponse>(`http://localhost:7108/api/v1/users/${userId}`, { headers });
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userIdKey);
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const payload = token.split('.')[1];
      const decodedJson = atob(payload);
      const decoded = JSON.parse(decodedJson);

      // Token içindeki claim'in tam adı
      return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? null;
    } catch {
      return null;
    }
  }
}
