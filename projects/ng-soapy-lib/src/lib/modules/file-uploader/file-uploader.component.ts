import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileEntity } from './file-uploader.interface';
import { FileUploaderService } from './file-uploader.service';

@Component({
  selector: 'lib-file-uploader',
  templateUrl: './file-uploader.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploaderComponent,
      multi: true
    }
  ]
})
export class FileUploaderComponent implements ControlValueAccessor {
  constructor(private fileUploaderService: FileUploaderService) {}

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  @Input() defaultSavePath: string = '';
  @Input() accept: string[] = [];
  @Input() multiple: boolean = false;

  handleFileUploaderChanged($event: Event) {
    $event.preventDefault();
    const files =
      ($event?.target as HTMLInputElement | undefined)?.files ?? null;
    const filesEntities = files
      ? Array.from(files).map((file) => new FileEntity(file))
      : [];
    if (!this.multiple) {
      this._value = filesEntities;
    } else {
      const filesForAdd = filesEntities.filter(
        (incomingFileEntity) =>
          this._value.findIndex(
            (existedFileEntity) =>
              incomingFileEntity.file.name === existedFileEntity.file.name
          ) < 0
      );
      this._value = [...this._value, ...filesForAdd];
    }
    if (this.fileInputRef) {
      const dataTransfer = new DataTransfer();
      this._value.forEach((fileEntity) =>
        dataTransfer.items.add(fileEntity.file)
      );
      this.fileInputRef.nativeElement.files = dataTransfer.files;
    }
    this._onChange(this._value);
  }

  createUploadTask() {
    return this.fileUploaderService.createUploadTask(
      this._value,
      this.defaultSavePath
    );
  }

  openFileSelectorDialog($event: MouseEvent) {
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.click();
      this._onTouched();
    }
  }

  // CVA
  private _value: FileEntity[] = [];

  private _isDisabled: boolean = false;
  get disabled() {
    return this._isDisabled;
  }

  private _onChange!: (filesEntities: FileEntity[]) => void;

  private _onTouched!: () => void;

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(filesEntities: FileEntity[]): void {
    this._value = filesEntities;
    if (this.fileInputRef) {
      const dataTransfer = new DataTransfer();
      this._value.forEach((fileEntity) =>
        dataTransfer.items.add(fileEntity.file)
      );
      this.fileInputRef.nativeElement.files = dataTransfer.files;
    }
  }

  setDisabledState(isDisabled: boolean) {
    this._isDisabled = isDisabled;
  }

  debug() {
    console.log(this.fileInputRef);
  }
}
