/*
In angular router when we try to redirect back to a route ends with param id, we will get errors,
so I created this proxy component which will help us redirecting back without any problems
*/

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect-back',
  template: ''
})
export class RedirectBackComponent implements OnInit {
  constructor(private location: Location, private router: Router) {}

  ngOnInit(): void {
    const parentPath = this.location.path().split('/').slice(0, -1);
    this.router.navigate(parentPath);
  }
}
