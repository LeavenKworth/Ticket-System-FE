import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {


        const role = this.authService.getUserRole();

        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'Support') {
          this.router.navigate(['/support']);
        } else if (role === 'Client') {
          this.router.navigate(['/client']);
        } else {
          this.errorMessage = 'Bilinmeyen kullanıcı rolü';
        }
      },
      error: (err) => {
        this.errorMessage = 'Email veya şifre hatalı!';
        console.error(err);
      }
    });


    }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  goToRegister() {
    this.router.navigate(['register']);
  }
}
