import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket.model';
import {RouterModule ,Router} from '@angular/router';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './admin-tickets.html',
  styleUrls: ['./admin-tickets.css'],
})
export class AdminTickets implements OnInit {
  tickets: Ticket[] = [];
  loading = false;
  errorMessage = '';

  constructor(private ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;

    this.ticketService.getAllTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Ticketlar yüklenemedi.';
        this.loading = false;
      },
    });
  }
  goToDetails(userId: number) {
    this.router.navigate(['/admin/ticket-detail/', userId]);
  }
}
