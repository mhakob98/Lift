import { Component, OnInit, OnDestroy } from '@angular/core';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { AccountSettings } from 'src/app/com/annaniks/lift/core/models/account';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-subscribe-parametres',
  templateUrl: './subscribe-parametres.component.html',
  styleUrls: ['./subscribe-parametres.component.scss']
})
export class SubscribeParametresComponent implements OnInit, OnDestroy {
  public settings: AccountSettings = new AccountSettings()
  private _subs = new SubSink();

  constructor(

    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService
  ) { }

  ngOnInit() {
    this._fetchSettings()
  }

  private _fetchSettings(): void {
    this._subs.add(
      this._autoSubscribeOrWatchStoryService.settingsState.subscribe((data: AccountSettings) => {
        this.settings = data
      })
    )
  }

  ngOnDestroy() {
    this._subs.unsubscribe()
  }
}
