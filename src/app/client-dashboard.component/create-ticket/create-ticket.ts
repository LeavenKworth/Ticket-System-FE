import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-ticket.html',
  styleUrls: ['./create-ticket.css'],
})
export class CreateTicketComponent {
  newTicket: Partial<Ticket> = {
    title: '',
    description: '',
    productId: ''
  };

  errorMessage = '';

  constructor(private ticketService: TicketService, private router: Router) {}

  createTicket(): void {
    if (!this.newTicket.title || !this.newTicket.description) {
      this.errorMessage = 'Başlık ve açıklama zorunludur.';
      return;
    }

    this.ticketService.createTicket(this.newTicket).subscribe({
      next: () => {
        this.router.navigate(['/client']);
      },
      error: () => {
        this.errorMessage = 'Ticket oluşturulamadı.';
      }
    });
  }
}
