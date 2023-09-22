import { Component } from '@angular/core';
import { faBell } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
})
export class UserNotificationsComponent {
  // ICONS
  notificationIcon = faBell;
  constructor() {}
}
