import { Component, Input, TemplateRef } from '@angular/core';
import { ListViewDataSource } from '../list-view/list-view-data-source';
import { GridListSortKeys } from './grid-list-sort-keys.interface';

@Component({
  selector: 'lib-grid-list',
  templateUrl: './grid-list.component.html',
})
export class GridListComponent {
  @Input() dataSource?: ListViewDataSource<any>;
  @Input() columns: number = 4;
  @Input() aspectRatio: string | number = '4:3';
  @Input() cardTemplate?: TemplateRef<any>;
  @Input() gutterSize: string = '1rem';
  @Input() sortKeys: GridListSortKeys = {};
}
