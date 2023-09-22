import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { from } from 'rxjs';
import { AuthService } from '../../../../auth';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogOutComponent {
  // ICONS
  logOut = faArrowRightFromBracket;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  logOutHandler($event: any) {
    from(this.authService.logout()).subscribe({
      next: () => {
        this.router.navigate(['/', 'account', 'login']);
      },
      error: () => {
        this.snackBar.open(
          'Unable to logout, please try again later.',
          'DISMISS',
          {
            duration: -1
          }
        );
      }
    });
  }
}
