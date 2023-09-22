import { InjectionToken } from '@angular/core';
import { SidebarMenu } from './side-bar-item.interface';
export const SIDEBAR_MENU = new InjectionToken<SidebarMenu>(
  'SideNav Menu Items'
);
