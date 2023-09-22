import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { CustomCardTemplateDirective } from '../directives/ng-templates.directive';
import { ListViewDataKeys } from '../list-view/list-view-data-keys.interface';
import { ListViewDataSource } from '../list-view/list-view-data-source';

@Component({
  selector: 'lib-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  // icons
  activeIcon = faCheck;
  inactiveIcon = faTimes;

  Object = Object;

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) set _matPaginator(matPaginator: MatPaginator) {
    if (this.dataSource && matPaginator) {
      this.dataSource.paginator = matPaginator;
    }
  }

  @Output() sorted = new EventEmitter();

  @Input() headerHidden = false;
  @Input() pageSize: number = 20;
  @Input() pageSizeOptions: number[] = [
    20,
    50,
    100,
    1000 // all elements
  ];
  @Input() showFirstLastButtons: boolean = false;
  @Input() dataSource?: ListViewDataSource<any>;
  @Input() actionsTemplate?: TemplateRef<any>;
  @Input() customTemplates?: QueryList<CustomCardTemplateDirective>;
  @Input() sortable: boolean = false;
  @Input() usePaginator: boolean = true;
  @Input() set dataKeys(value: ListViewDataKeys) {
    this.dataKeys$.next(value);
  }
  @Input() set visibleKeys(keys: string[]) {
    this.visibleKeys$.next(keys);
  }

  visibleKeys$ = new BehaviorSubject<string[]>([]);
  dataKeys$ = new BehaviorSubject<ListViewDataKeys | undefined>(undefined);

  constructor(private router: Router) {}

  dropHandler(event: CdkDragDrop<string[]>) {
    if (!this.dataSource) return;
    moveItemInArray(
      this.dataSource.data,
      event.previousIndex,
      event.currentIndex
    );
    this.dataSource.data = this.dataSource.data.slice();
  }

  sortChangeHandler(event: Sort) {
    const { active, direction } = event;
    this.router.navigate([], {
      queryParams: {
        sort: direction ? active : null,
        order: direction ? direction : null
      },
      queryParamsHandling: 'merge'
    });
  }

  resolveObjectKey(path: string, obj: any) {
    return path.split('.').reduce(function (prev, curr) {
      return prev ? prev[curr] : null;
    }, obj || self);
  }

  getTemplateForAttribute(name?: string): TemplateRef<any> | null {
    if (!name) return null;

    const locatedDirective = this.customTemplates?.find((template) => {
      return template.name === name;
    });

    if (!locatedDirective) return null;

    return locatedDirective.template;
  }

  getDate(value: any) {
    try {
      return value.toDate();
    } catch (e) {
      return null;
    }
  }
}
