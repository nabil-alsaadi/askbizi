import {
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { QueryConstraint } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faAlignJustify,
  faColumns,
  faFileExport,
  faFilter,
  faSpinner,
  faTh
} from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, switchMap } from 'rxjs';
import { FirestoreSubCollectionService } from '../../../classes/firestore-sub-collection.service';
import { FirestoreService } from '../../../classes/firestore.service';
import { SubSink } from '../../../classes/subsink';
import {
  ActionsCardTemplateDirective,
  CardTemplateDirective,
  CustomCardTemplateDirective,
  FiltersTemplateDirective,
  TableActionsDirective
} from '../directives/ng-templates.directive';
import { GridListSortKeys } from '../grid-list/grid-list-sort-keys.interface';
import { ListViewDataKeys } from './list-view-data-keys.interface';
import { ListViewDataSource } from './list-view-data-source';

export interface ListViewState {
  error: boolean;
  loading: boolean;
  listStyle: string;
  showFilters: boolean;
}

@Component({
  selector: 'lib-list-view',
  templateUrl: './list-view.component.html'
})
export class ListViewComponent implements OnDestroy, OnInit {
  // ICONS
  listIcon = faAlignJustify;
  gridIcon = faTh;
  loadingIcon = faSpinner;
  fieldsIcon = faColumns;
  exportIcon = faFileExport;
  filtersIcon = faFilter;

  @ViewChild('keysSelectionList') keysSelectionList?: MatSelectionList;
  @Output() tableSorted = new EventEmitter();

  @Input() dataSource?:
    | FirestoreService<any>
    | FirestoreSubCollectionService<any>;
  @Input() parentId?: string = '';
  @Input() dataKeys: ListViewDataKeys = {};
  @Input() sortKeys: GridListSortKeys = {};
  @Input() visibleKeys: string[] = [];
  @Input() listStyle: 'grid' | 'table' = 'table';
  @Input() allowStyleChange = true;
  @Input() gridColumns: number = 4;
  @Input() gridAspectRatio: string | number = '4:3';
  @Input() tableHeaderHidden: boolean = false;
  @Input() gridGapSize: string = '1rem';
  @Input() showSearch: boolean = true;
  @Input() sortable: boolean = false;
  @Input() simpleSource: boolean = true;
  @Input() searchKeys?: string[];

  @Input() usePaginator: boolean = false;
  @Input() filters: BehaviorSubject<QueryConstraint[]> = new BehaviorSubject<
    QueryConstraint[]
  >([]);

  // card template variable must be called data e.g: <ng-template let-item="data"></ng-template>
  @ContentChild(CardTemplateDirective, { read: TemplateRef })
  cardTemplate?: TemplateRef<any>;
  @ContentChild(ActionsCardTemplateDirective, { read: TemplateRef })
  actionsTemplate?: TemplateRef<any>;
  @ContentChild(TableActionsDirective, { read: TemplateRef })
  tableActionsTemplate?: TemplateRef<any>;
  @ContentChildren(CustomCardTemplateDirective)
  tableCustomCardsTemplates?: QueryList<CustomCardTemplateDirective>;
  @ContentChild(FiltersTemplateDirective, { read: TemplateRef })
  filtersTemplate?: TemplateRef<any>;

  initialState: ListViewState = {
    error: false,
    loading: false,
    listStyle: 'table',
    showFilters: false
  };

  subs = new SubSink();
  _visibleKeys: string[] = [];

  state$ = new BehaviorSubject<ListViewState>(this.initialState);
  visibleKeys$ = new BehaviorSubject<string[]>([]);

  listViewDataSource?: ListViewDataSource<any>;

  searchFormGroup = this.fb.group({
    searchText: ['']
  });

  // Lifecycle

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.dataSource)
      throw new Error('ListViewComponent: dataSource is required');
    this.listViewDataSource = new ListViewDataSource(
      this.dataSource,
      this.filters,
      { usePagination: this.usePaginator },
      this.parentId ?? ''
    );

    this.subs.sink = this.searchFormGroup.valueChanges
      .pipe(
        switchMap((value) => {
          if (!this.listViewDataSource)
            throw new Error('ListViewComponent: no data source set');
          this.searchKeys = this.searchKeys ?? [];
          return this.listViewDataSource.search(
            value.searchText,
            this.searchKeys ?? []
          );
        })
      )
      .subscribe({ next: (data) => this.listViewDataSource?.data$.next(data) });

    this.subs.sink = this.route.queryParams.subscribe((params) => {
      this.state$.next({
        ...this.state$.value,
        showFilters: params['filters'] === 'true'
      });
    });

    this._visibleKeys = this.visibleKeys;
    this.visibleKeys$.next(this.visibleKeys);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  selectedViewHandler(e: any) {
    this.state$.next({
      ...this.state$.value,
      listStyle: e.value
    });
  }

  // FIELD SELECT

  menuSelectionChangeHandler(e: any) {
    const selected = e.option._selected as boolean;
    if (!selected && this.visibleKeys$.value.length < 2) return;
    const itemIndex = e.option.selectionList._keyManager
      ._activeItemIndex as number;
    const newSelection = this._visibleKeys.filter((key, index) => {
      return (
        (index !== itemIndex && this.visibleKeys$.value.includes(key)) ||
        (index === itemIndex && selected)
      );
    });
    this.visibleKeys$.next(newSelection);
  }

  menuOptionClickHandler(e: Event) {
    e.stopPropagation();
  }

  // FILTERS

  filtersChangedHandler(e: any) {}
  toggleShowFilters(e: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        filters: !e.value
      },
      queryParamsHandling: 'merge'
    });
  }

  // SEARCH

  searchPhrase: string = '';
  searchSubmittedHandler(e: any) {
    if (!this.searchKeys)
      throw new Error('ListViewComponent: searchKeys is required');
  }
}
