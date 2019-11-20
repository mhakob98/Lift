import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubmenuItem } from '../../../core/models/submenu-Item';
import { Limits } from '../../../core/models/limits';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  public items: SubmenuItem[] = [];
  public limits: Limits;
  public currentRoute = '';

  constructor(
    private _router: Router
  ) {
    this.currentRoute = _router.url;
    console.log(this.currentRoute);

  }

  ngOnInit() {
  }

}
