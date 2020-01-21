import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AutoSubscribeOrWatchStoryService } from './auto-subscribe-watch-story.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-auto-subscribe-watch-story',
  templateUrl: './auto-subscribe-watch-story.component.html',
  styleUrls: ['./auto-subscribe-watch-story.component.scss']
})
export class AutoSubscribeOrWatchStoryComponent implements OnInit, OnDestroy {
  public currentRoute = ''
  private _subs = new SubSink();

  constructor(
    private _router: Router,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService

  ) {
    this.currentRoute = _router.url;
  }

  ngOnInit() {
  }
  public onSettingsSave(): void {
    this._subs.add(
      this._autoSubscribeOrWatchStoryService.saveSettings().subscribe((data) => {
        console.log(data);

      })
    )
  }
  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
