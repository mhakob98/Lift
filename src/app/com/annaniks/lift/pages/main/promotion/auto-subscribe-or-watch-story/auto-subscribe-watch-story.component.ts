import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AutoSubscribeOrWatchStoryService } from './auto-subscribe-watch-story.service';
import { SubSink } from 'subsink';
import { AuthService } from '../../../../core/services/auth.service';
import { switchMap, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AccountSettings } from '../../../../core/models/account';
import { LoadingService } from '../../../../core/services/loading-service';

@Component({
  selector: 'app-auto-subscribe-watch-story',
  templateUrl: './auto-subscribe-watch-story.component.html',
  styleUrls: ['./auto-subscribe-watch-story.component.scss']
})
export class AutoSubscribeOrWatchStoryComponent implements OnInit, OnDestroy {
  public loading: boolean = false;
  private _subs = new SubSink();
  public currentRoute = '';
  public massfollowingData: AccountSettings = new AccountSettings();
  constructor(
    private _router: Router,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService,
    private _authService: AuthService,
    private _loadingService: LoadingService

  ) {
    this.currentRoute = this._router.url;
  }

  ngOnInit() {
    this._fetchSettingsData();
  }

  private _fetchSettingsData(): void {
    this._loadingService.showLoading();
    this._authService.getActiveAccount()
      .pipe(
        switchMap((account) => {
          if (account) {
            return this.getSettings(account.id);
          }
          return of();
        })
      ).subscribe(data => {
        this._loadingService.hideLoading();
        window.scrollTo(0, 0)
        this.massfollowingData = data.data;
      });
  }

  public onSettingsSave(): void {
    this._loadingService.showLoading()
    this._subs.add(
      this._autoSubscribeOrWatchStoryService.saveSettings()
        .subscribe((data) => {
          this._loadingService.hideLoading()
        }, error => {
          this._loadingService.hideLoading()
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
