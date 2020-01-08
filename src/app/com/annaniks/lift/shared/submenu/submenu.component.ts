import { Component, OnInit, Input } from '@angular/core';
import { SubmenuItem } from '../../core/models/submenu-Item';
import { OnChange } from '../../core/decorators/watch-property-change';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss']
})
export class SubmenuComponent implements OnInit {

  @OnChange<SubmenuItem[]>(function (value) {
    console.log(value);
  })
  @Input()
  items: SubmenuItem[];

  constructor() { }

  ngOnInit() {
  }

}
