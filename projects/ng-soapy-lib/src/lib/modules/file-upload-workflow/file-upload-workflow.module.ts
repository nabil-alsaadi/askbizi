import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TruncateTextWithExtensionModule } from '../../pipes/truncate-text-with-extension/truncate-text-with-extension.module';
import { FileUploadWorkFlowComponent } from './file-upload-workflow.component';
import { FileUploadWorkFlowService } from './file-upload-workflow.service';

@NgModule({
  declarations: [FileUploadWorkFlowComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    FontAwesomeModule,
    TruncateTextWithExtensionModule
  ],
  exports: [FileUploadWorkFlowComponent],
  providers: [FileUploadWorkFlowService]
})
export class FileUploadWorkFlowModule {}
