import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  StorageReference,
  uploadBytesResumable
} from '@angular/fire/storage';
import {
  BehaviorSubject,
  concatMap,
  defer,
  finalize,
  from,
  shareReplay,
  Subject
} from 'rxjs';

import {
  FileEntity,
  UploadStatus,
  UploadTask
} from './file-uploader.interface';

@Injectable()
export class FileUploaderService {
  constructor(private storage: Storage) {}

  createUploadTask(files: FileEntity[], defaultUploadPath: string) {
    const filesProgress: number[] = [];
    const filesReferences: StorageReference[] = [];
    const _status$ = new BehaviorSubject<UploadStatus>('idle');
    const _totalProgress$ = new BehaviorSubject<number>(0);
    const _downloadUrls$ = defer(() =>
      Promise.all(
        filesReferences.map((fileRef) =>
          getDownloadURL(fileRef).then((downloadUrl) => ({
            fileName: fileRef.name,
            downloadUrl
          }))
        )
      )
    );
    const _task$ = new BehaviorSubject<UploadTask>({
      status$: _status$
        .asObservable()
        .pipe(finalize(() => console.log('status completed'))),
      progress$: _totalProgress$
        .asObservable()
        .pipe(finalize(() => console.log('progress completed'))),
      downloadUrls$: _downloadUrls$.pipe(
        finalize(() => console.log('download url'))
      )
    });
    return defer(() => {
      _status$.next('uploading');
      from(files)
        .pipe(
          concatMap((fileEntity, index) => {
            const fileName = fileEntity.saveAsName ?? fileEntity.file.name;
            const filePath = fileEntity.uploadPath ?? defaultUploadPath;
            const fileRef = ref(this.storage, `${filePath}/${fileName}`);
            filesReferences.push(fileRef);
            filesProgress[index] = 0;
            const currentFileUploadTask = uploadBytesResumable(
              fileRef,
              fileEntity.file
            );
            const _currentFileTaskCompleted$ = new Subject<void>();
            currentFileUploadTask.on('state_changed', {
              next: (uploadTaskSnapshot) => {
                const currentFileProgress = Math.floor(
                  (100 * uploadTaskSnapshot.bytesTransferred) /
                    (files.length * uploadTaskSnapshot.totalBytes)
                );
                const previousFilesProgress = filesProgress.reduce(
                  (acc, curr, i) => (i < index ? acc + curr : acc),
                  0
                );
                filesProgress[index] = currentFileProgress;
                _totalProgress$.next(
                  currentFileProgress + previousFilesProgress
                );
              },
              complete: async () => {
                _currentFileTaskCompleted$.complete();
                if (index === files.length - 1) {
                  _totalProgress$.next(100);
                  _status$.next('uploaded');
                  _totalProgress$.complete();
                  _status$.complete();
                  _task$.complete();
                }
              },
              error: (error) => {
                _status$.next('failed');
                _task$.error(error);
              }
            });
            return _currentFileTaskCompleted$.asObservable();
          })
        )
        .subscribe();
      return _task$.asObservable().pipe(
        shareReplay(),
        finalize(() => console.log('task completed'))
      );
    });
  }
}
