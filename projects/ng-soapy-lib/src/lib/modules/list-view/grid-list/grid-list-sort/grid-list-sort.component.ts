import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from '../../../../classes/subsink';
import { GridListSortKeys } from '../grid-list-sort-keys.interface';

@Component({
  selector: 'lib-grid-list-sort',
  templateUrl: './grid-list-sort.component.html',
})
export class GridListSortComponent implements OnInit {
  @Input() keys: GridListSortKeys = {};

  formGroup: FormGroup = this.fb.group({
    sort: [null],
    order: [null],
  });

  subs = new SubSink();

  Object = Object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.route.queryParamMap.subscribe((params) => {
      const sort = params.get('sort') ?? null;
      const order = params.get('order') ?? null;

      this.formGroup.patchValue({
        sort,
        order,
      });
    });

    this.subs.sink = this.formGroup.valueChanges.subscribe(
      ({ sort, order }) => {
        this.router.navigate([], {
          queryParams: {
            sort: order ? sort : null,
            order: order ? order : null,
          },
          queryParamsHandling: 'merge',
        });
      }
    );
  }
}
