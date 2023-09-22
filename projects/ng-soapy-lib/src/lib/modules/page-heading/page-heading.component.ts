import { Location } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  PageHeadingActionsTemplateDirective,
  PrefixDirectiveTemplateDirective
} from './directives/ng-templates.directive';

@Component({
  selector: 'lib-page-heading',
  templateUrl: './page-heading.component.html'
})
export class PageHeadingComponent {
  @Input() superTitle?: string;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() backLink?: string[];
  @Input() hideBackButton = false;
  @ContentChild(PageHeadingActionsTemplateDirective, { read: TemplateRef })
  actionsTemplate?: TemplateRef<any>;
  @ContentChild(PrefixDirectiveTemplateDirective, { read: TemplateRef })
  prefixTemplate?: TemplateRef<any>;

  constructor(
    private location: Location,
    private router: Router //private route: ActivatedRoute
  ) {}

  goBackHandler($event: MouseEvent) {
    /*
    this.router.navigate(['..'], { relativeTo: this.route });
    return;
    */

    if (this.backLink) {
      if(this.backLink == ["/"]) {
          const parentPath = this.location.path().split('/').slice(0, -1);
          this.router.navigate(parentPath);
      }
      else {
        this.router.navigate(this.backLink);
      }
      
    } else {
      this.location.back();
      // const parentPath = this.location.path().split('/').slice(0, -1);
      // this.router.navigate(parentPath);
    }
  }
}
