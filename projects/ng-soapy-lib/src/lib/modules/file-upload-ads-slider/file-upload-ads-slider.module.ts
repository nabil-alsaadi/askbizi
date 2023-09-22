import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TruncateTextWithExtensionModule } from '../../pipes/truncate-text-with-extension/truncate-text-with-extension.module';
import { FileUploadAdsSliderComponent } from './file-upload-ads-slider.component';
import { FileUploadAdsSliderService } from './file-upload-ads-slider.service';

@NgModule({
  declarations: [FileUploadAdsSliderComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    FontAwesomeModule,
    TruncateTextWithExtensionModule
  ],
  exports: [FileUploadAdsSliderComponent],
  providers: [FileUploadAdsSliderService]
})
export class FileUploadAdsSliderModule {}
