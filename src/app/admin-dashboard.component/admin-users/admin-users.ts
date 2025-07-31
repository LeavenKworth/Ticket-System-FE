import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
      this.loading = false;
    });
  }

  goToDetails(userId: number) {
    this.router.navigate(['/admin/user-detail/', userId]);
  }
}
