import { IconDefinition } from '@fortawesome/fontawesome-common-types';

export type SidebarMenu = { label: string; children: SideNavItem[] }[];

export interface SideNavItem {
  title: string;
  icon?: IconDefinition;
  route: string[];
  query?: any;
  iconHtml?: string;
  role?: string;
}
