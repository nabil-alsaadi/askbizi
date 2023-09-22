import {
  AngularFirestore,
  CollectionReference,
  FieldPath,
  Query,
  DocumentData,
} from '@angular/fire/compat/firestore';
import { OrderByDirection, WhereFilterOp } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, NEVER, Observable } from 'rxjs';
import { debounceTime, distinct, switchMap, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface PaginatedCollectionOptions {
  active?: boolean;
  pageSize?: number;
  initialPage?: number;
  orderBy?: {
    path: string;
    direction?: OrderByDirection;
  };
}

export class PaginatedCollection<T> {
  items$: Observable<T[]>;
  orderBy$ = new BehaviorSubject<{
    path: string;
    direction?: OrderByDirection;
  } | null>(null);
  limit$ = new BehaviorSubject<number>(50);
  filters$ = new BehaviorSubject<
    { path: FieldPath; opStr: WhereFilterOp; value: any }[] | null
  >(null);
  between$ = new BehaviorSubject<{
    path: FieldPath;
    from: any;
    to: any;
  } | null>(null);
  active$ = new BehaviorSubject<boolean>(true);
  currentPage = 1;
  navStack: string[] = [];
  firstItemId: string | null = null;
  lastItemId: string | null = null;
  isLoading: boolean = false;
  navStackId?: string;
  options: PaginatedCollectionOptions;
  lastItemsReached: boolean = false;
  lastQueryItemsCount: number = 0;
  constructor(
    db: AngularFirestore,
    path: string,
    options: PaginatedCollectionOptions
  ) {
    const defaultOptions = {
      active: true,
      pageSize: 50,
      initialPage: 1,
      orderBy: null,
    };
    this.options = Object.assign(defaultOptions, options);
    this.navStackId = uuidv4();
    if (this.options.pageSize && this.options.initialPage)
      this.limit$.next(this.options.pageSize * this.options.initialPage);
    if (this.options.orderBy) this.orderBy$.next(this.options.orderBy);
    this.items$ = combineLatest([
      this.active$,
      this.orderBy$,
      this.limit$,
      this.filters$,
      this.between$,
    ]).pipe(
      distinct(),
      debounceTime(1),
      switchMap(([active, orderBy, limit, filters, between]) => {
        if (!active) return NEVER;
        this.isLoading = true;
        return db
          .collection<T>(path, (ref) => {
            let query: CollectionReference<DocumentData> | Query<DocumentData> =
              ref;
            if (filters && filters.length > 0)
              filters.forEach((filter) => {
                query = query.where(filter.path, filter.opStr, filter.value);
              });
            if (filters && filters.length > 0)
              filters.forEach((filter) => {
                if (filter.opStr != '==' && filter.opStr != 'in')
                  query = query.orderBy(filter.path, 'asc');
              });
            if (between) {
              query = query
                .orderBy(between.path, 'asc')
                .startAt(between.from)
                .endAt(between.to)
                .limit(limit);
              return query;
            }
            if (orderBy) {
              query = query.orderBy(orderBy.path, orderBy.direction);
            }
            query = query.limit(limit);
            return query;
          })
          .valueChanges({ idField: 'uid' })
          .pipe(
            tap((results) => {
              this.isLoading = false;
              if (results.length < this.limit$.value) {
                this.lastItemsReached = true;
              } else {
                this.lastItemsReached = false;
              }
            })
          );
      })
    );
  }
  loadMore() {
    this.currentPage++;
    if (!this.options.pageSize) throw new Error('pageSize is not defined');
    if (this.isLoading || this.lastItemsReached) return;
    this.limit$.next(this.options.pageSize * this.currentPage);
  }
}
