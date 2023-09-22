import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TruncateTextWithExtensionPipe } from './truncate-text-with-extension.pipe';

@NgModule({
  declarations: [TruncateTextWithExtensionPipe],
  imports: [CommonModule],
  exports: [TruncateTextWithExtensionPipe]
})
export class TruncateTextWithExtensionModule {}
