import {
  docSnapshots,
  limit,
  QueryConstraint,
  startAfter,
  startAt
} from '@angular/fire/firestore';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { endBefore } from 'firebase/firestore';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  concatWith,
  defer,
  map,
  NEVER,
  of,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import { FirebaseEntity } from 'soapy-types';
import { FirestoreSubCollectionService } from '../../../classes/firestore-sub-collection.service';
import { FirestoreService } from '../../../classes/firestore.service';
import { SubSink } from '../../../classes/subsink';

export class ListViewDataSource<
  T extends FirebaseEntity
> extends MatTableDataSource<T> {
  constructor(
    private dataSource: FirestoreService<T> | FirestoreSubCollectionService<T>,
    private filters: BehaviorSubject<QueryConstraint[]>,
    private options: {
      usePagination: boolean;
    },
    private parentId: string
  ) {
    super();
  }

  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string | undefined>(undefined);

  data$ = new BehaviorSubject<Partial<T>[]>([]);
  subs = new SubSink();
  pagesPointers: string[] = [];

  search(searchPhrase: string, searchKeys: string[]) {
    console.log('search');
    if (this.options.usePagination)
      throw new Error('search with pagination not supported');
    return this.getData().pipe(
      tap(() => {
        this.loading$.next(true);
        this.error$.next(undefined);
      }),
      map((data) => {
        return data.filter((item) => {
          return searchKeys.some((key) => {
            return this.resolveObjectKey(key, item)
              ? this.resolveObjectKey(key, item)
                  .toString()
                  .toLowerCase()
                  .includes(searchPhrase.toLowerCase())
              : false;
          });
        });
      }),
      tap(() => {
        this.loading$.next(false);
        this.error$.next(undefined);
      }),
      catchError((error) => {
        this.loading$.next(false);
        this.error$.next(error?.message ?? 'unknown error');
        return of([] as Partial<T>[]);
      })
    );
  }

  currentPageSize?: number;
  total$ = new BehaviorSubject<number>(0);
  pageIndex$ = new BehaviorSubject<number>(0);

  override set paginator(paginator: MatPaginator) {
    if (!paginator) return;
    super.paginator = paginator;

    const paginationEvent$ = paginator.page.pipe(
      tap((event) => {
        console.log('page event', event);
        this.loading$.next(true);
        this.error$.next(undefined);
      }),
      switchMap((page: PageEvent) => {
        if (paginator.pageSize === 1000)
          return this.getData(...this.filters.value).pipe(
            map((data) => {
              this.pagesPointers = [];
              this.allowNone(paginator);
              return data;
            })
          );
        // no page size change
        if (this.currentPageSize === page.pageSize) {
          // next page
          if (page.pageIndex > (page.previousPageIndex ?? 0)) {
            console.log('next page');
            const newPageFirstDocumentSnap = this.getSnap(
              `${this.data$.value[this.data$.value.length - 1].uid}`
            );
            return newPageFirstDocumentSnap.pipe(
              switchMap((pointer) =>
                this.getData(
                  ...this.filters.value,
                  limit(paginator.pageSize + 1),
                  startAfter(pointer)
                ).pipe(
                  map((data) => {
                    if (!this.pagesPointers.includes(`${data[0]?.uid}`))
                      this.pagesPointers.push(`${data[0]?.uid}`);
                    if (data.length > paginator.pageSize) {
                      this.allowNextBack(paginator);
                      return data.slice(0, data.length - 1);
                    }
                    this.allowBack(paginator);
                    return data;
                  })
                )
              )
            );
          }
          // previous page
          console.log('previous page');
          if (page.pageIndex < (page.previousPageIndex ?? 0)) {
            this.pagesPointers.pop();
            const newPageFirstDocumentSnap$ = this.getSnap(
              `${this.pagesPointers[this.pagesPointers.length - 1]}`
            );
            return newPageFirstDocumentSnap$.pipe(
              switchMap((pointer) =>
                pointer.exists()
                  ? combineLatest([
                      this.getData(
                        ...this.filters.value,
                        limit(paginator.pageSize),
                        startAt(pointer)
                      ),
                      this.getData(
                        ...this.filters.value,
                        limit(1),
                        endBefore(pointer)
                      )
                    ]).pipe(
                      map((data) =>
                        data.reduce((acc, curr) => [...acc, ...curr], [])
                      ),
                      map((data) => {
                        if (data.length > paginator.pageSize) {
                          this.allowNextBack(paginator);
                          return data.slice(0, data.length - 1);
                        }
                        this.allowNext(paginator);
                        return data;
                      })
                    )
                  : this.getData(
                      ...this.filters.value,
                      limit(paginator.pageSize + 1)
                    ).pipe(
                      map((data) => {
                        this.pagesPointers = [`${data[0]?.uid}`];
                        if (data.length > paginator.pageSize) {
                          this.allowNext(paginator);
                          return data.slice(0, data.length - 1);
                        }
                        this.allowNone(paginator);
                        return data;
                      })
                    )
              )
            );
          }
        }
        // page size changed
        console.log('page size changed');
        return this.getData(
          ...this.filters.value,
          limit(paginator.pageSize + 1)
        ).pipe(
          map((data) => {
            this.currentPageSize = page.pageSize;
            this.pagesPointers = [];
            if (!data.length) {
              this.allowNone(paginator);
              return [];
            }
            this.pagesPointers = [`${(data[0] as any)?.uid}`];
            paginator.pageIndex = 0;
            if (data.length > paginator.pageSize) {
              this.allowNext(paginator);
              return data.slice(0, data.length - 1);
            }
            this.allowNone(paginator);
            return data;
          })
        );
      }),
      tap(() => {
        this.loading$.next(false);
        this.error$.next(undefined);
      }),
      catchError((error) => {
        this.loading$.next(false);
        this.error$.next(error?.message ?? 'unknown error');
        return of([] as Partial<T>[]);
      })
    );

    // only when paginator initialized for first time
    console.log('only one time');
    this.subs.sink = of(null)
      .pipe(
        tap(() => {
          this.currentPageSize = paginator.pageSize;
          this.loading$.next(true);
          this.error$.next(undefined);
        }),
        switchMap(() => {
          if (paginator.pageSize === 1000)
            return this.getData(...this.filters.value).pipe(
              takeUntil(paginationEvent$),
              map((data) => {
                this.pagesPointers = [];
                this.allowNone(paginator);
                return data;
              })
            );
          return this.getData(
            ...this.filters.value,
            limit(paginator.pageSize + 1)
          ).pipe(
            takeUntil(paginationEvent$),
            map((data) => {
              if (data.length > paginator.pageSize) {
                this.allowNext(paginator);
                if (!this.pagesPointers.includes(`${data[0]?.uid}`))
                  this.pagesPointers.push(`${data[0]?.uid}`);
                return data.slice(0, data.length - 1);
              }
              this.allowNone(paginator);
              return data;
            }),
            tap(() => {
              this.loading$.next(false);
              this.error$.next(undefined);
            })
          );
        }),
        concatWith(NEVER), // make sure data$ will not complete if this stream completed
        catchError((error) => {
          this.loading$.next(false);
          this.error$.next(error?.message ?? 'unknown error');
          return of([] as Partial<T>[]);
        })
      )
      .subscribe(this.data$);

    this.subs.sink = paginationEvent$.subscribe(this.data$);
  }

  override connect(): BehaviorSubject<T[]> {
    if (!this.options.usePagination) {
      console.log('no pagination');
      this.subs.sink = of(null)
        .pipe(
          tap(() => {
            this.loading$.next(true);
            this.error$.next(undefined);
          }),
          switchMap(() => this.getData(...this.filters.value)),
          tap(() => {
            this.loading$.next(false);
            this.error$.next(undefined);
          }),
          catchError((error) => {
            this.loading$.next(false);
            this.error$.next(error?.message ?? 'unknown error');
            return of([] as Partial<T>[]);
          })
        )
        .subscribe(this.data$);
    }

    return this.data$ as any;
  }

  override disconnect(): void {
    this.subs.unsubscribe();
  }

  override get data(): T[] {
    return this.data$.value as any;
  }

  override set data(data: T[]) {
    this.data$.next(data);
  }

  private getRef(uid: string) {
    if (this.dataSource instanceof FirestoreSubCollectionService)
      return this.dataSource.getDocumentRef(this.parentId, uid);

    return this.dataSource.getDocumentRef(uid);
  }

  private getSnap(uid: string) {
    return defer(() => docSnapshots(this.getRef(uid)));
  }

  private getData(...constraints: QueryConstraint[]) {
    if (this.dataSource instanceof FirestoreService)
      return this.dataSource.data(...constraints);
    if (this.dataSource instanceof FirestoreSubCollectionService)
      return this.dataSource.data(this.parentId, ...constraints);
    return of([]);
  }

  private allowNext(paginator: MatPaginator) {
    this.total$.next(paginator.pageSize + 1);
    paginator.pageIndex = 0;
  }

  private allowBack(paginator: MatPaginator) {
    this.total$.next(paginator.pageSize + 1);
    paginator.pageIndex = 1;
  }

  private allowNextBack(paginator: MatPaginator) {
    this.total$.next(3 * paginator.pageSize);
    paginator.pageIndex = 1;
  }

  private allowNone(paginator: MatPaginator) {
    this.total$.next(paginator.pageSize);
    paginator.pageIndex = 0;
  }

  private resolveObjectKey(path: string, obj: any) {
    return path.split('.').reduce(function (prev, curr) {
      return prev ? prev[curr] : null;
    }, obj || self);
  }
}
