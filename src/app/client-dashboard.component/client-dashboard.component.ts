import { Component, OnInit } from '@angular/core';
import { TicketService } from '../services/ticket';
import { Ticket } from '../models/ticket.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  loading = true;
  errorMessage = '';
  statusFilter: string = 'Hepsi';
  userName: string = 'Kullanıcı';


  constructor(private ticketService: TicketService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserName();
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTicketsByUser().subscribe({
      next: (data) => {
        this.tickets = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Ticketlar yüklenemedi.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.statusFilter === 'Hepsi') {
      this.filteredTickets = this.tickets;
    } else {
      this.filteredTickets = this.tickets.filter(t => t.status === this.statusFilter);
    }
  }

  loadUserName(): void {
    const userIdStr = localStorage.getItem('userId');
    if (userIdStr) {
      const userId = Number(userIdStr);
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.userName = user.name || 'Kullanıcı';
        },
        error: () => {
          this.userName = 'Kullanıcı';
        }
      });
    }
  }
}
