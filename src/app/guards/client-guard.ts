import { CanActivateFn} from '@angular/router';
import { inject} from  '@angular/core'
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

// Client Guard
export const clientGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const role = authService.getUserRole();
  if (role === 'Client') {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
