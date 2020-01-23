import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AutoSubscribeOrWatchStoryService } from './auto-subscribe-watch-story.service';
import { SubSink } from 'subsink';
import { AuthService } from '../../../../core/services/auth.service';
import { switchMap, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AccountSettings } from '../../../../core/models/account';
import { ToastrService } from 'ngx-toastr';

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
    private _toastrService: ToastrService

  ) {
    this.currentRoute = this._router.url;
  }

  ngOnInit() {
    this._fetchSettingsData();
  }

  private _fetchSettingsData(): void {
    this._authService.getActiveAccount()
      .pipe(
        switchMap((account) => {
          if (account) {
            return this.getSettings(account.id);
          }
          return of();
        })
      ).subscribe(data => {
        this.massfollowingData = data.data;
      });
  }

  public onSettingsSave(): void {
    this.loading = true;
    this._subs.add(
      this._autoSubscribeOrWatchStoryService.saveSettings()
        .pipe(finalize(() => this.loading = false))
        .subscribe((data) => {
          this._toastrService.success('Изменение успешно сохранены');
        }, (err) => {
          this._toastrService.error('Ошибка');
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
