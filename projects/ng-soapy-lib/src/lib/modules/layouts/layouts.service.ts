import { Inject, Injectable } from '@angular/core';
import { SidebarMenu } from './side-bar-item.interface';
import { SIDEBAR_MENU } from './sidebar-menu-token';

@Injectable()
export class LayoutsService {
  sideBarMenu: SidebarMenu = this.sideNavMenu;

  constructor(@Inject(SIDEBAR_MENU) private sideNavMenu: SidebarMenu) {}
}
