import { Observable } from 'rxjs';

export type UploadStatus = 'uploading' | 'idle' | 'failed' | 'uploaded';

export class FileEntity {
  private _file: File;
  private _uploadPath?: string;
  private _saveAsName?: string;

  constructor(file: File, uploadPath?: string, saveAs?: string) {
    this._file = file;
    this._uploadPath = uploadPath;
    this._saveAsName = saveAs;
  }

  get uploadPath() {
    return this._uploadPath;
  }

  set uploadPath(uploadPath: string | undefined) {
    this._uploadPath = uploadPath;
  }

  get saveAsName() {
    return this._saveAsName;
  }

  set saveAsName(saveAsName: string | undefined) {
    this._saveAsName = saveAsName;
  }

  get file() {
    return this._file;
  }
}

export type UploadTask = {
  status$: Observable<UploadStatus>;
  progress$: Observable<number>;
  downloadUrls$: Observable<
    {
      fileName: string;
      downloadUrl: string;
    }[]
  >;
};
