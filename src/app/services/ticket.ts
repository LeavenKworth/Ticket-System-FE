import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://localhost:7108/api/v1/tickets';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllTickets(): Observable<Ticket[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Ticket[]>(this.apiUrl,  { headers });
  }

  createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    const headers = this.getAuthHeaders();
    return this.http.post<Ticket>(this.apiUrl, ticket, { headers });
  }

  getTicketsByUser(): Observable<Ticket[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Ticket[]>(`${this.apiUrl}/ByUser`, { headers });
  }
  getTicketsByUserId(userId: number): Observable<Ticket[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Ticket[]>(`${this.apiUrl}/ByUserId/${userId}`, { headers });
  }
  getTicketById(id: number): Observable<Ticket> {
    const headers = this.getAuthHeaders();
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`, { headers });
  }

}
