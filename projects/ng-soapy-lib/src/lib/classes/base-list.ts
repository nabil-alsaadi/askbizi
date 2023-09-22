import { PaginatedCollection } from './paginated-collection';

export abstract class BaseList<T> {
  showLoadMore = false;
  protected pageSize = 50;
  protected currentPage = 1;
  protected collection?: PaginatedCollection<T>;

  updateCollection(
    filters: any = [],
    orderBy?: any,
    page?: number,
    between?: any
  ) {
    if (!this.collection) throw new Error('Collection is not defined');
    this.collection.items$.subscribe({
      next: (items) => {
        if (items.length >= this.pageSize) {
          this.showLoadMore = true;
        }
      },
    });

    this.currentPage = page ?? 1;
    this.collection.filters$.next(filters);
    if (orderBy) {
      this.collection.orderBy$.next(orderBy);
    }
    this.collection.limit$.next(this.pageSize * this.currentPage);
    this.collection.active$.next(true);
    this.collection.between$.next(between);
  }

  loadMore() {
    if (this.collection?.isLoading || this.collection?.lastItemsReached) return;
    this.goToPage(this.currentPage + 1);
  }

  abstract goToPage(page: number): void;
}
