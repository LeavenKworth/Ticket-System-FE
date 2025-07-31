import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import { TicketComment } from '../../models/ticket-comment.model';
import { User } from '../../models/user.model';
import { TicketService } from '../../services/ticket';
import { TicketCommentsService } from '../../services/ticket-comment';
import { UserService } from '../../services/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-detail.html',
  styleUrls: ['./ticket-detail.css']
})
export class TicketDetailComponent implements OnInit {
  ticketId!: number;
  ticket!: Ticket | null;
  comments: TicketComment[] = [];
  loading = true;
  errorMessage = '';
  newCommentText = '';
  addingComment = false;

  userNames = new Map<number, string>();

  currentUserId: number = 0;
  currentUserRole : string = '';

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private commentService: TicketCommentsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    const storedUserId = localStorage.getItem('userId');
    this.currentUserId = storedUserId ? Number(storedUserId) : 0;
    this.currentUserRole = localStorage.getItem('userRole') || '';
    this.fetchTicket();
    this.fetchComments();
  }

  fetchTicket(): void {
    this.loading = true;
    this.ticketService.getAllTickets().subscribe({
      next: (tickets) => {
        const found = tickets.find(t => t.id === this.ticketId);
        if (found) {
          this.ticket = found;
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Ticket bulunamadı';
          this.ticket = null;
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Ticket verileri alınamadı.';
        this.loading = false;
      }
    });
  }

  fetchComments(): void {
    const role = localStorage.getItem('role') || '';

    this.commentService.getCommentsByTicketId(this.ticketId).subscribe({
      next: async (comments) => {
        this.comments = role === 'client'
          ? comments.filter(c => !c.isInternal)
          : comments;
        this.comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());


        await this.loadUserNamesForComments(this.comments);
      },
      error: () => {
        this.errorMessage = 'Yorumlar alınamadı.';
      }
    });
  }

  async loadUserNamesForComments(comments: TicketComment[]) {
    const uniqueUserIds = Array.from(
      new Set(
        comments
          .map(c => c.userId)
          .filter((id): id is number => typeof id === 'number' && id !== null && id !== undefined)
      )
    );

    const userIdsToFetch = uniqueUserIds.filter(id => !this.userNames.has(id));

    try {
      const userPromises = userIdsToFetch.map(id =>
        firstValueFrom(this.userService.getUserById(id))
          .catch(() => null)
      );

      const users = await Promise.all(userPromises);

      users.forEach(user => {
        if (user) {
          this.userNames.set(user.id, user.name);
        }
      });
    } catch {
      // hata yutulabilir, kullanıcı isimleri eksik kalabilir
    }
  }

  getUserName(userId: number): string {
    return this.userNames.get(userId) || 'Anonim';
  }

  addComment(): void {
    if (!this.newCommentText.trim()) return;

    this.addingComment = true;
    this.commentService.addComment(this.ticketId, this.newCommentText).subscribe({
      next: () => {
        this.newCommentText = '';
        this.addingComment = false;
        this.fetchComments();
      },
      error: () => {
        this.errorMessage = 'Yorum eklenemedi.';
        this.addingComment = false;
      }
    });
  }
}
