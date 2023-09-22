import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TruncateTextWithExtensionModule } from '../../pipes/truncate-text-with-extension/truncate-text-with-extension.module';
import { FileUploadItemCategoryComponent } from './file-upload-item-category.component';
import { FileUploadItemCategoryService } from './file-upload-item-category.service';

@NgModule({
  declarations: [FileUploadItemCategoryComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    FontAwesomeModule,
    TruncateTextWithExtensionModule
  ],
  exports: [FileUploadItemCategoryComponent],
  providers: [FileUploadItemCategoryService]
})
export class FileUploadItemCategoryModule {}
