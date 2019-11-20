import { Component, OnInit, Input } from '@angular/core';
import { Limits } from '../../core/models/limits';

@Component({
  selector: 'app-limits',
  templateUrl: './limits.component.html',
  styleUrls: ['./limits.component.scss']
})
export class LimitsComponent implements OnInit {

  @Input()
  limits: Limits

  constructor() { }

  ngOnInit() {
  }

}
