import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
  UploadTask
} from '@angular/fire/storage';
import { FileUpload } from '../file-upload/file-upload.model';

@Injectable()
export class FileUploadItemCategoryService {
  private basePath = '/itemCategories';

  constructor(private storage: Storage) {}

  pushFileToStorage(
    fileUpload: FileUpload,
    onComplete: (result: FileUpload) => void,
    onProgress: (percentage: number) => void
  ): UploadTask {
    const filePath = `${this.basePath}/${Date.now()}-${fileUpload.file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, fileUpload.file);
    uploadTask.on('state_changed', {
      next: (snapshot) => {
        onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      error: (error) => {
        fileUpload.error = error.message;
        onComplete(fileUpload);
      },
      complete: () => {
        getDownloadURL(storageRef).then((downloadUrl) => {
          fileUpload.url = downloadUrl;
          fileUpload.path = filePath;
          fileUpload.name = fileUpload.file.name;
          onComplete(fileUpload);
        });
      }
    });
    return uploadTask;
  }
}
