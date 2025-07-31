import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket.model';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-tickets.html',
  styleUrls: ['./admin-tickets.css'],
})
export class AdminTickets implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  loading = false;
  errorMessage = '';

  filterField: string = 'title';
  filterValue: string = '';

  startDate: string = '';
  endDate: string = '';

  constructor(private ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;

    this.ticketService.getAllTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Ticketlar yüklenemedi.';
        this.loading = false;
      },
    });
  }

  goToDetails(ticketId: number) {
    this.router.navigate(['/admin/ticket-detail/', ticketId]);
  }

  applyFilter() {
    if (this.filterField === 'date') {
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      this.filteredTickets = this.tickets.filter((ticket) => {
        const createdAtDate = new Date(ticket.createdAt);
        if (start && end) {
          return createdAtDate >= start && createdAtDate <= end;
        } else if (start) {
          return createdAtDate >= start;
        } else if (end) {
          return createdAtDate <= end;
        }
        return true;
      });
    } else {
      const filterVal = this.filterValue.toLowerCase();
      this.filteredTickets = this.tickets.filter((ticket) => {
        let fieldVal = '';
        switch (this.filterField) {
          case 'title':
            fieldVal = ticket.title;
            break;
          case 'status':
            fieldVal = ticket.status;
            break;
          case 'createdBy':
            fieldVal = ticket.createdBy;
            break;
          default:
            fieldVal = '';
        }
        return fieldVal.toLowerCase().includes(filterVal);
      });
    }
  }
}
