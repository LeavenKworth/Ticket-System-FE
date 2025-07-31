import { Component, OnInit } from '@angular/core';
import { TicketService } from '../services/ticket';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Ticket } from '../models/ticket.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-support-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './support-dashboard.component.html',
  styleUrls: ['./support-dashboard.component.css']
})
export class SupportDashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  loading = false;
  errorMessage = '';

  filterField: string = 'title';
  filterValue: string = '';
  startDate?: string;
  endDate?: string;

  constructor(private ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    this.loadAssignedTickets();
  }

  loadAssignedTickets(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      this.errorMessage = 'Kullanıcı bilgisi alınamadı.';
      return;
    }

    this.loading = true;
    this.ticketService.getTicketsAssignedToSupportUser(userId).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filteredTickets = [...tickets];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Atanmış ticketlar yüklenemedi.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.filterValue && !this.startDate && !this.endDate) {
      this.filteredTickets = [...this.tickets];
      return;
    }

    this.filteredTickets = this.tickets.filter(ticket => {
      if (this.filterField === 'date') {
        const ticketDate = new Date(ticket.createdAt);
        const start = this.startDate ? new Date(this.startDate) : null;
        const end = this.endDate ? new Date(this.endDate) : null;

        if (start && ticketDate < start) return false;
        if (end && ticketDate > end) return false;
        return true;
      } else {
        const fieldValue = (ticket as any)[this.filterField] as string;
        if (!fieldValue) return false;
        return fieldValue.toLowerCase().includes(this.filterValue.toLowerCase());
      }
    });
  }

  goToDetail(ticketId: number): void {
    this.router.navigate(['/support/ticket-detail', ticketId]);
  }
}
