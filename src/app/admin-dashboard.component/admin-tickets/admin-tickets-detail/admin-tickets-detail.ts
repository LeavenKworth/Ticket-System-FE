import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TicketService } from '../../../services/ticket';
import { TicketCommentsService } from '../../../services/ticket-comment';
import { Ticket } from '../../../models/ticket.model';
import { TicketComment } from '../../../models/ticket-comment.model';
import { UserService } from '../../../services/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-tickets-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-tickets-detail.html',
  styleUrls: ['./admin-tickets-detail.css'],
})
export class AdminTicketsDetail implements OnInit {
  ticketId!: number;
  ticket!: Ticket;
  comments: TicketComment[] = [];
  newComment: string = '';
  isInternal: boolean = false;

  loading: boolean = false;
  error: string = '';

  userNames = new Map<number, string>(); // userId → userName map

  selectedStatus: string = '';

  statusDisplayMap: Record<string, string> = {
    Open: 'Açık',
    Inprogress: 'İşleniyor',
    Closed: 'Kapalı',
  };

  statusApiMap: Record<string, string> = {
    Açık: 'Open',
    İşleniyor: 'Inprogress',
    Kapalı: 'Closed',
  };

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private commentService: TicketCommentsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.ticketId) {
      this.loadTicket();
      this.loadComments();
    } else {
      this.error = 'Geçersiz Ticket ID';
    }
  }

  loadTicket(): void {
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.error = '';
        // backend durumdan frontend seçime dönüştür
        this.selectedStatus = this.statusDisplayMap[ticket.status] || ticket.status;
      },
      error: () => (this.error = 'Ticket bilgisi yüklenemedi.'),
    });
  }

  loadComments(): void {
    this.commentService.getCommentsByTicketId(this.ticketId).subscribe({
      next: async (comments) => {
        this.comments = comments;
        this.error = '';
        await this.loadUserNamesForComments(comments);
      },
      error: () => (this.error = 'Yorumlar yüklenemedi.'),
    });
  }

  async loadUserNamesForComments(comments: TicketComment[]) {
    const uniqueUserIds = Array.from(new Set(comments.map((c) => c.userId)));
    const userIdsToFetch = uniqueUserIds.filter((id) => !this.userNames.has(id));

    const userPromises = userIdsToFetch.map((id) =>
      firstValueFrom(this.userService.getUserById(id)).catch(() => null)
    );

    const users = await Promise.all(userPromises);

    users.forEach((user) => {
      if (user) {
        this.userNames.set(user.id, user.name || 'Anonim');
      }
    });
  }

  getUserName(userId: number): string {
    return this.userNames.get(userId) ?? 'Anonim';
  }

  sendComment(): void {
    if (!this.newComment.trim()) return;

    this.loading = true;
    const serviceCall = this.isInternal
      ? this.commentService.addCommentInternal(this.ticketId, this.newComment)
      : this.commentService.addComment(this.ticketId, this.newComment);

    serviceCall.subscribe({
      next: (comment) => {
        this.comments.push(comment);
        this.newComment = '';
        this.isInternal = false;
        this.loading = false;
      },
      error: () => {
        this.error = 'Yorum gönderilemedi.';
        this.loading = false;
      },
    });
  }

  changeStatus() {
    if (!this.ticket || this.selectedStatus === this.statusDisplayMap[this.ticket.status]) return;

    this.loading = true;
    const backendStatus = this.statusApiMap[this.selectedStatus];
    this.ticketService.updateTicketStatus(this.ticket.id, backendStatus).subscribe({
      next: () => {
        this.ticket.status = backendStatus;
        this.loading = false;
        alert('Durum başarıyla güncellendi.');
      },
      error: (err) => {
        this.loading = false;
        alert('Durum güncellenirken hata oluştu: ' + (err.message || err));
      },
    });
  }
}
