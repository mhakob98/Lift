import { Component, OnInit } from '@angular/core';
import { SubmenuItem } from '../../../core/models/submenu-Item';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  public items: SubmenuItem[] = []
  constructor() { }

  ngOnInit() {

  }

}
