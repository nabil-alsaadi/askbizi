import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MomentModule } from 'ngx-moment';
import { CollapsibleModule } from '../collapsible/collapsible.module';
import {
  ActionsCardTemplateDirective,
  CardTemplateDirective,
  CustomCardTemplateDirective,
  FiltersTemplateDirective,
  TableActionsDirective
} from './directives/ng-templates.directive';
import { GridListSortComponent } from './grid-list/grid-list-sort/grid-list-sort.component';
import { GridListComponent } from './grid-list/grid-list.component';
import { ListViewComponent } from './list-view/list-view.component';
import { TableComponent } from './table/table.component';

const components = [
  TableComponent,
  GridListComponent,
  GridListSortComponent,
  CardTemplateDirective,
  ActionsCardTemplateDirective,
  TableActionsDirective,
  CustomCardTemplateDirective,
  FiltersTemplateDirective,
  ListViewComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    DragDropModule,
    ReactiveFormsModule,
    // Material Modules
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatGridListModule,
    MatSortModule,
    MatButtonToggleModule,
    MatInputModule,
    MatTooltipModule,
    CdkAccordionModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
    // App Modules
    CollapsibleModule,
    // Third Party Modules
    MomentModule
  ],
  exports: components
})
export class ListViewModule {}
