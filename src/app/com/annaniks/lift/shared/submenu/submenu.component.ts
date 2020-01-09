import { Component, OnInit, Input } from '@angular/core';
import { SubmenuItem } from '../../core/models/submenu-Item';
import { OnChange } from '../../core/decorators/watch-property-change';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss']
})
export class SubmenuComponent implements OnInit {
  public currentRoute: string;

  @OnChange<SubmenuItem[]>(function (value) {
    console.log(value);
  })
  @Input()
  items: SubmenuItem[];

  constructor(
    private _router: Router,
  ) {
    this._takeOutCurrentRoute();
  }

  ngOnInit() {
  }

  private _takeOutCurrentRoute(): void {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }
}