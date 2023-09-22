import { Directive, EventEmitter, Input, TemplateRef } from '@angular/core';
import { QueryConstraint } from '@angular/fire/firestore';

@Directive({ selector: '[grid-card-template]' })
export class CardTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[list-view-actions-card]' })
export class ActionsCardTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
@Directive({ selector: '[list-view-custom-card]' })
export class CustomCardTemplateDirective {
  @Input() name?: string;
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[table-actions]' })
export class TableActionsDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[list-filters]' })
export class FiltersTemplateDirective {
  changed = new EventEmitter<QueryConstraint[]>();

  constructor(public template: TemplateRef<any>) {}
}
