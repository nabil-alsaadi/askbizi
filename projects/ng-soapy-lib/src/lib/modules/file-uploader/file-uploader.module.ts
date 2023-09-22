import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileUploaderComponent } from './file-uploader.component';
import { FileUploaderService } from './file-uploader.service';

@NgModule({
  declarations: [FileUploaderComponent],
  imports: [CommonModule],
  providers: [FileUploaderService],
  exports: [FileUploaderComponent]
})
export class FileUploaderModule {}
