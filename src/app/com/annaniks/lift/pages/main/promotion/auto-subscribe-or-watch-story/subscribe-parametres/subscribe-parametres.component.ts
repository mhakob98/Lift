import { Component, OnInit, OnDestroy } from '@angular/core';
import { AutoSubscribeOrWatchStoryService } from '../../../../../shared/services/auto-subscribe-watch-story.service';
import { MassFollowingSettings } from 'src/app/com/annaniks/lift/core/models/account';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscribe-parametres',
  templateUrl: './subscribe-parametres.component.html',
  styleUrls: ['./subscribe-parametres.component.scss']
})
export class SubscribeParametresComponent implements OnInit, OnDestroy {
  public settings: MassFollowingSettings = new MassFollowingSettings()
  private _subs = new SubSink();
  public isAutosubscribe: boolean = false;
  show = false
  constructor(
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService,
    private _router: Router,
  ) {
    this.isAutosubscribe = this._router.url != '/promotion/auto-watch-story';
  }

  ngOnInit() {
    this._fetchSettings()
  }

  private _fetchSettings(): void {

    this.settings = this._autoSubscribeOrWatchStoryService.settings
    this._subs.add(
      this._autoSubscribeOrWatchStoryService.settingsState.subscribe((data: MassFollowingSettings) => {
        this.settings = data;
      })
    )
  }

  ngOnDestroy() {
    this._subs.unsubscribe()
  }
}
