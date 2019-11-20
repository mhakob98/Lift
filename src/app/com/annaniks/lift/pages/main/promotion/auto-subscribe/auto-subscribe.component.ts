import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { AutoSubscribeService } from './auto-subscribe.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-auto-subscribe',
  templateUrl: './auto-subscribe.component.html',
  styleUrls: ['./auto-subscribe.component.scss']
})
export class AutoSubscribeComponent implements OnInit {

  constructor(private _autoSubscribeService: AutoSubscribeService) { }

  ngOnInit() {
  }

}
