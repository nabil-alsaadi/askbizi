import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TruncateTextWithExtensionModule } from '../../pipes/truncate-text-with-extension/truncate-text-with-extension.module';
import { FileUploadComponent } from './file-upload.component';
import { FileUploadService } from './file-upload.service';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    FontAwesomeModule,
    TruncateTextWithExtensionModule
  ],
  exports: [FileUploadComponent],
  providers: [FileUploadService]
})
export class FileUploadModule {}
