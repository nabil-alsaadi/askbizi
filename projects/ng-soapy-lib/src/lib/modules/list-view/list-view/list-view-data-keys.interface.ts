export interface ListViewDataKeys {
  [key: string]: {
    type: string;
    label: string;
    routerLink?: string[];
    templateName?: string;
    noPadding?: boolean;
    sortable?: boolean;
  };
}
