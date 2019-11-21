import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auto-subscribe-watch-story',
  templateUrl: './auto-subscribe-watch-story.component.html',
  styleUrls: ['./auto-subscribe-watch-story.component.scss']
})
export class AutoSubscribeOrWatchStoryComponent implements OnInit {
  public currentRoute = ''

  constructor(private _router: Router) {
    this.currentRoute = _router.url;
  }

  ngOnInit() {
  }

}
