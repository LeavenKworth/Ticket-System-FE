
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="flex flex-col items-center gap-4 p-8">
      <h1 class="text-3xl font-bold text-indigo-600 mb-6">Admin Panel</h1>

      <a routerLink="/admin/users" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl">
        👤 Kullanıcıları Yönet
      </a>

      <a routerLink="/admin/tickets" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl">
        🎫 Ticketları Yönet
      </a>
    </div>
  `
})
export class AdminDashboardComponent {}
