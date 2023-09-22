import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  OnDestroy,
  Optional,
  Pipe,
  PipeTransform
} from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { from, Observable, of, tap } from 'rxjs';

@Pipe({
  name: 'getDownloadUrl',
  pure: false
})
export class GetDownloadUrlPipe implements PipeTransform, OnDestroy {
  private asyncPipe: AsyncPipe;
  private path?: string;
  private downloadUrl$?: Observable<any>;

  constructor(
    private storage: Storage,
    cdr: ChangeDetectorRef,
    @Optional() private state: TransferState
  ) {
    this.asyncPipe = new AsyncPipe(cdr);
  }

  transform(path: string) {
    if (!path) return this.asyncPipe.transform(null);
    if (path !== this.path) {
      this.path = path;
      const key = makeStateKey<string>(`|getDownloadURL|${path}`);
      const existing = this.state?.get(key, undefined);
      const pathRef = ref(this.storage, path);
      this.downloadUrl$ = existing
        ? of(existing)
        : from(getDownloadURL(pathRef)).pipe(
            tap((url) => this.state?.set(key, url))
          );
    }
    return this.asyncPipe.transform(this.downloadUrl$);
  }

  ngOnDestroy() {
    this.asyncPipe.ngOnDestroy();
  }
}
