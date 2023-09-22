import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GetDownloadUrlPipe } from './get-download-url.pipe';

@NgModule({
  declarations: [GetDownloadUrlPipe],
  imports: [CommonModule],
  exports: [GetDownloadUrlPipe]
})
export class GetDownloadUrlModule {}
