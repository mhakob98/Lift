import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Limits } from '../../../core/models/limits';
import { NavbarItem } from '../../../core/models/navbar';
import { NavbarService } from '../../../core/services/navbar.service';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {
  public items: NavbarItem[] = [];
  public limits: Limits;
  public currentRoute = '';

  constructor(
    private _router: Router,
    private _navbarService: NavbarService
  ) {
    this.currentRoute = _router.url;
    this.items = [
      {
        label:'Автоподписка',
        routerLink:'/promotion/autosubscribe'
      },
      {
        label:'Автопросмотр Stories',
        routerLink:'/promotion/auto-watch-story'
      },
      {
        label:'Бонусы от LIFT',
        routerLink:'/promotion/bonuses'
      }
    ]
    this._navbarService.setNavbarItems(this.items);
  }

  ngOnInit() {}

}
