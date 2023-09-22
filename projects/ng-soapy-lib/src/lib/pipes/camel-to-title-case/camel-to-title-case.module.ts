import { NgModule } from '@angular/core';
import { CamelToTitleCasePipe } from './camel-to-title-case.pipe';

@NgModule({
  declarations: [CamelToTitleCasePipe],
  exports: [CamelToTitleCasePipe],
})
export class CamelToTitleCaseModule {}
