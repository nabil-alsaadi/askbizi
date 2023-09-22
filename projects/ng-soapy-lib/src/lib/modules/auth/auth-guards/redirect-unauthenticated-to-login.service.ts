import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class RedirectUnauthenticatedToLogin implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    if (this.authService.currentUser$.value) {
      return true;
    }
    this.router.navigate(['/account/login']);
    return false;
  }
}
