export interface TicketComment {
  id: number;
  ticketId: number;
  comment: string;
  createdAt: string;
  userId: number;
  isInternal: boolean;
}
