import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AutoSubscribeOrWatchStoryService } from './auto-subscribe-watch-story.service';
import { SubSink } from 'subsink';
import { AuthService } from '../../../../core/services/auth.service';
import { switchMap, takeUntil, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-auto-subscribe-watch-story',
  templateUrl: './auto-subscribe-watch-story.component.html',
  styleUrls: ['./auto-subscribe-watch-story.component.scss']
})
export class AutoSubscribeOrWatchStoryComponent implements OnInit, OnDestroy {
  private _loading: boolean = false;
  private _subs = new SubSink();
  public currentRoute = '';
  public massfollowingData: any = {}
  constructor(
    private _router: Router,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService,
    private _authService: AuthService

  ) {
    this.currentRoute = _router.url;
  }

  ngOnInit() {
    this._fetchSettingsData();
  }

  private _fetchSettingsData(): void {
    this._authService.getActiveAccount()
      .pipe(
        switchMap((account) => {
          if (account) {
            return this.getSettings(account.id)
          }
          return of();
        })
      ).subscribe(data => {
        this.massfollowingData = data.data
      });
  }

  public onSettingsSave(): void {
    this._loading = true;
    this._subs.add(
      this._autoSubscribeOrWatchStoryService.saveSettings()
        .pipe(finalize(() => this._loading = false))
        .subscribe((data) => {
        })
    )
  }

  public getSettings(accountId: number): Observable<any> {
    return this._autoSubscribeOrWatchStoryService.getSettings(accountId);
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
