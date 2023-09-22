import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  faCloudUpload,
  faFile,
  faFilePdf,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import { UploadTask } from 'firebase/storage';
import {
  FileUpload,
  FileUploaderValue
} from '../file-upload/file-upload.model';
import { FileUploadItemCategoryService } from './file-upload-item-category.service';

@Component({
  selector: 'lib-file-upload-item-category',
  templateUrl: './file-upload-item-category.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FileUploadItemCategoryComponent)
    }
  ]
})
export class FileUploadItemCategoryComponent implements ControlValueAccessor {
  download = faCloudUpload;

  @Input() title = 'Select';
  @Input() multiple = false;
  @Input() showBrowserButton = true;
  @Input() showProgressBar = true;
  @Output() startUploading = new EventEmitter();
  @Output() fileChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  set acceptExtension(value: string[]) {
    if (value) this.acceptExtensions = value.join(',');
  }

  @Input() set isReset(value: boolean) {
    /* reset the file upload */
    if (value) {
      this.selectedFiles = [];
      this.uploadProgress = [];
      this.uploadTasks = [];
      this.value = [];
      if (this._fileSelector) {
        this._fileSelector.value = '';
      }
    }
  }

  selectedFiles: File[] = [];
  uploadProgress: number[] = [];
  uploadTasks: UploadTask[] = [];
  value: FileUploaderValue[] = [];
  acceptExtensions: string =
    'image/png, image/jpg, image/jpeg, application/pdf';

  @ViewChild('fileSelector')
  set fileSelector(element: ElementRef) {
    if (element) {
      this._fileSelector = <HTMLInputElement>element.nativeElement;
    }
  }

  private _fileSelector: HTMLInputElement | null = null;
  private changed: (value: any) => void = () => {};
  private touched: (value: any) => void = () => {};

  constructor(
    private fileUploadItemCategoryService: FileUploadItemCategoryService
  ) {}

  onBrowse() {
    if (this._fileSelector) {
      this._fileSelector.click();
    }
  }

  onUpload() {
    this.startUploading.emit(true);
    //make sure we have files selected
    if (this.selectedFiles.length > 0) {
      //loop through selected files
      this.selectedFiles.forEach((selectedFile, index) => {
        //notify parent that files are added
        this.fileChanged.emit(true);

        if (index > this.uploadProgress.length - 1) {
          //create an upload task
          const task = this.fileUploadItemCategoryService.pushFileToStorage(
            new FileUpload(selectedFile),
            (res) => this.uploadCompleteHandler(res),
            (progress) => {
              if (progress) {
                this.uploadProgress[index] = progress;
              }
            }
          );
          this.uploadTasks.push(task);
          this.uploadProgress.push(0);
        }
      });
    }
  }

  uploadCompleteHandler(result: FileUpload) {
    //push resulted upload to form value accessor
    this.value.push(result);
    this.changed(this.value);
    this.touched(this.value);
    this.startUploading.emit(false);
  }

  onFileChange($event: any) {
    if (this._fileSelector && this._fileSelector.files) {
      if (!this.multiple && this._fileSelector.files.length === 1) {
        this.showBrowserButton = false;
        this.selectedFiles.push(this._fileSelector.files[0]);
      }
      this.onUpload();
    }
  }

  deleteFileHandler(fileindex: number) {
    //filter all file related data
    this.selectedFiles.splice(fileindex, 1);
    this.uploadProgress.splice(fileindex, 1);
    this.value.splice(fileindex, 1);
    //if no files are available notify parent that all files are deleted
    if (this.selectedFiles.length <= 0) this.fileChanged.emit(false);
    this.showBrowserButton = true;
    this.changed(this.value);
    this.touched(this.value);
  }

  fileIcon(type: string) {
    switch (type) {
      case 'image/png':
        return faImage;
      case 'image/jpeg':
        return faImage;
      case 'image/jpg':
        return faImage;
      case 'application/pdf':
        return faFilePdf;
      default:
        return faFile;
    }
  }
  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
      this.changed(obj);
      this.touched(obj);
    }
  }
  registerOnChange(fn: any): void {
    this.changed = fn;
  }
  registerOnTouched(fn: any): void {
    this.touched = fn;
  }
}
