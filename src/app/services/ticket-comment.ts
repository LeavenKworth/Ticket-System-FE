import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketComment } from '../models/ticket-comment.model';

@Injectable({
  providedIn: 'root'
})
export class TicketCommentsService {
  private apiUrl = 'https://localhost:7108/api/v1/comments';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCommentsByTicketId(ticketId: number): Observable<TicketComment[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<TicketComment[]>(`${this.apiUrl}/ticket/${ticketId}`, { headers });
  }

  addComment(ticketId: number, commentText: string): Observable<TicketComment> {
    const headers = this.getAuthHeaders();
    return this.http.post<TicketComment>(
      this.apiUrl,
      { ticketId, comment: commentText },
      { headers }
    );
  }
  addCommentInternal(ticketId: number, commentText: string): Observable<TicketComment> {
    const headers = this.getAuthHeaders();
    return this.http.post<TicketComment>(
      `${this.apiUrl}/internal`,
      {ticketId, comment: commentText},
      {headers}
    );
  }

}
