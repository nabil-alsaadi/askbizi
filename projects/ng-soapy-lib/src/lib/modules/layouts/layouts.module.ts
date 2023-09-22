import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthModule } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// APP IMPORTS
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { CopyrightsComponent } from './default-layout/partials/copyrights/copyrights.component';
import { LogOutComponent } from './default-layout/partials/logout/logout.component';
import { NavLogoComponent } from './default-layout/partials/nav-logo/nav-logo.component';
import { UserNotificationsComponent } from './default-layout/partials/user-notifications/user-notifications.component';
import { LayoutsService } from './layouts.service';
import { SidebarMenu } from './side-bar-item.interface';
import { SIDEBAR_MENU } from './sidebar-menu-token';

const components = [
  DefaultLayoutComponent,
  CopyrightsComponent,
  NavLogoComponent,
  UserNotificationsComponent,
  LogOutComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    FontAwesomeModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    AuthModule
  ],
  providers: [LayoutsService]
})
export class LayoutsModule {
  static forRoot(sideNavMenu: SidebarMenu) {
    return {
      ngModule: LayoutsModule,
      providers: [
        {
          provide: SIDEBAR_MENU,
          useValue: sideNavMenu
        }
      ]
    };
  }
}
