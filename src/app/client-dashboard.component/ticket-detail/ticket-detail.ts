import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import { TicketComment } from '../../models/ticket-comment.model';
import { User } from '../../models/user.model';
import { TicketService } from '../../services/ticket';
import { TicketCommentsService } from '../../services/ticket-comment';
import { UserService } from '../../services/user';
import { ImageService } from '../../services/image';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
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
  currentUserRole: string = '';

  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  imagePreviewUrl: string | null = null;

  enlargedImageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private commentService: TicketCommentsService,
    private userService: UserService,
    private imageService: ImageService,
    private router: Router,
    private sanitizer: DomSanitizer
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
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (ticket) => {
        if (ticket) {
          this.ticket = ticket;
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Ticket bulunamadı';
          this.ticket = null;
        }
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/unauthorized']);
        } else {
          this.errorMessage = 'Ticket verileri alınamadı.';
        }
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
        comments.map(c => c.userId)
          .filter((id): id is number => typeof id === 'number' && id !== null && id !== undefined)
      )
    );

    const userIdsToFetch = uniqueUserIds.filter(id => !this.userNames.has(id));

    try {
      const userPromises = userIdsToFetch.map(id =>
        firstValueFrom(this.userService.getUserById(id)).catch(() => null)
      );

      const users = await Promise.all(userPromises);
      users.forEach(user => {
        if (user) {
          this.userNames.set(user.id, user.name);
        }
      });
    } catch {
      // hata yutulabilir
    }
  }

  getUserName(userId: number): string {
    return this.userNames.get(userId) || 'Anonim';
  }

  sanitizeImageUrl(url: string): string {
    return url.replace('https://', 'http://'); // SafeUrl kullanmadık çünkü ngSrc string bekler
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Ön izleme oluştur
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  addComment(): void {
    if (!this.newCommentText.trim()) return;

    this.addingComment = true;
    this.uploadProgress = null;

    if (this.selectedFile) {
      this.imageService.uploadImage(this.selectedFile).subscribe({
        next: event => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            const imageUrl = event.body?.url;
            this.submitComment(imageUrl);
          }
        },
        error: () => {
          this.errorMessage = 'Resim yüklenirken hata oluştu.';
          this.addingComment = false;
        }
      });
    } else {
      this.submitComment(null);
    }
  }

  private submitComment(imageUrl: string | null) {
    this.commentService.addComment(this.ticketId, this.newCommentText, imageUrl ?? undefined ).subscribe({
      next: () => {
        this.newCommentText = '';
        this.selectedFile = null;
        this.uploadProgress = null;
        this.imagePreviewUrl = null;
        this.addingComment = false;
        this.fetchComments();
      },
      error: () => {
        this.errorMessage = 'Yorum eklenemedi.';
        this.addingComment = false;
      }
    });
  }

  openImageModal(url: string): void {
    this.enlargedImageUrl = url;
  }

  closeImageModal(): void {
    this.enlargedImageUrl = null;
  }
}
