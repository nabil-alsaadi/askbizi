import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
  PageHeadingActionsTemplateDirective,
  PrefixDirectiveTemplateDirective,
} from './directives/ng-templates.directive';
import { PageHeadingComponent } from './page-heading.component';

@NgModule({
  declarations: [
    PageHeadingComponent,
    PageHeadingActionsTemplateDirective,
    PrefixDirectiveTemplateDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    // Material
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    PageHeadingComponent,
    PageHeadingActionsTemplateDirective,
    PrefixDirectiveTemplateDirective,
  ],
})
export class PageHeadingModule {}
