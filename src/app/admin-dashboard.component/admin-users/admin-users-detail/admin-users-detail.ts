import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user';
import { TicketService } from '../../../services/ticket';
import { User } from '../../../models/user.model';
import { Ticket } from '../../../models/ticket.model';

@Component({
  selector: 'app-admin-users-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-users-detail.html',
  styleUrls: ['./admin-users-detail.css']
})
export class AdminUsersDetailComponent implements OnInit {
  user: User | null = null;
  userTickets: Ticket[] = [];
  userId!: number;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUserById(this.userId).subscribe(user => {
      this.user = user;
    });

    this.ticketService.getTicketsByUserId(this.userId).subscribe(tickets => {
      this.userTickets = tickets;
    });
  }

  deleteUser(): void {
    if (!this.user) return;

    if (confirm(`${this.user.name} adlı kullanıcıyı silmek istediğinize emin misiniz?`)) {
      this.userService.deleteUser(this.user.id).subscribe({
        next: () => {
          alert('Kullanıcı başarıyla silindi.');
          this.router.navigate(['/admin/users']);
        },
        error: () => {
          alert('Kullanıcı silinirken hata oluştu.');
        }
      });
    }
  }
}
