import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="max-w-md w-full bg-white p-6 rounded-xl shadow-md text-center">
        <h1 class="text-4xl font-bold text-red-600 mb-4">Yetkisiz Erişim</h1>
        <p class="text-gray-700 mb-6">Bu sayfaya erişim izniniz yok.</p>
        <button
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          (click)="goBack()"
        >
          Geri Dön
        </button>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {
  constructor(private location: Location , private  router: Router) { }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
      window.history.back();
    } else {
      this.router.navigate(['/login']);
    }
  }


}
