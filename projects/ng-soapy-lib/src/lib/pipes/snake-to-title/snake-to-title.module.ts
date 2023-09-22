import { NgModule } from '@angular/core';
import { SnakeToTitlePipe } from './snake-to-title.pipe';

@NgModule({
  declarations: [
    SnakeToTitlePipe
  ],
  exports: [
    SnakeToTitlePipe
  ]
})
export class SnakeToTitleModule { }
