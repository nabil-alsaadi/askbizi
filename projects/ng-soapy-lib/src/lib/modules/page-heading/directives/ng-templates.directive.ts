import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[page-heading-actions]' })
export class PageHeadingActionsTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[page-heading-prefix]' })
export class PrefixDirectiveTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
