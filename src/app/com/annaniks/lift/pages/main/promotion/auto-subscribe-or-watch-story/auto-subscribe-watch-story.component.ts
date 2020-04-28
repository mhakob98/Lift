import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AutoSubscribeOrWatchStoryService } from '../../../../shared/services/auto-subscribe-watch-story.service';
import { SubSink } from 'subsink';
import { AuthService } from '../../../../core/services/auth.service';
import { switchMap, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MassFollowingSettings } from '../../../../core/models/account';
import { LoadingService } from '../../../../core/services/loading-service';
import { ToastrService } from 'ngx-toastr';
import { Limits } from '../../../../core/models/limits';

@Component({
  selector: 'app-auto-subscribe-watch-story',
  templateUrl: './auto-subscribe-watch-story.component.html',
  styleUrls: ['./auto-subscribe-watch-story.component.scss']
})
export class AutoSubscribeOrWatchStoryComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();
  public loading: boolean = false;
  public isAutosubscribe: boolean = false;
  public massfollowingData: MassFollowingSettings = new MassFollowingSettings();
  public limits: Limits;

  constructor(
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService,
    private _authService: AuthService,
    private _loadingService: LoadingService,
    private _toastrService: ToastrService,
    private _activatedRoute: ActivatedRoute

  ) {
    this.isAutosubscribe = this._activatedRoute.snapshot.data.type == 'subscribe';
  }

  ngOnInit() {
    this._autoSubscribeOrWatchStoryService.resetSettings();
    this._fetchSettingsData();
  }

  private _fetchSettingsData(): void {
    this._loadingService.showLoading();
    this._authService.getActiveAccount()
      .pipe(
        switchMap((account) => {
          this._autoSubscribeOrWatchStoryService.resetSettings();
          if (account && account.id) {
            return this.getSettings(account.id);
          }
          return of();
        })
      ).subscribe(data => {
        this._loadingService.hideLoading();
        window.scrollTo(0, 0);
        this.massfollowingData = data.data;
        this.limits = {
          subscribersForDay: this.massfollowingData.subscribesPerDay,
          subscribersForHour: this.massfollowingData.subscribesPerHour,
          accountAge: 0,
          unsubscribe: ''
        }
      });
  }

  public onSettingsSave(): void {
    this._loadingService.showLoading();
    this._subs.add(
      this._autoSubscribeOrWatchStoryService.saveSettings(this.isAutosubscribe)
        .pipe(finalize(() => this._loadingService.hideLoading()))
        .subscribe((data) => {
          this._toastrService.success('Изменение успешно сохранены');
          this._loadingService.hideLoading();

        }, (err) => {
          this._toastrService.error('Ошибка');
          this._loadingService.hideLoading();
        })
    )
  }

  public getSettings(accountId: number): Observable<any> {
    this._loadingService.showLoading();
    return this._autoSubscribeOrWatchStoryService.getSettings(this.isAutosubscribe, accountId)
      .pipe(finalize(() => {
        this._loadingService.hideLoading();
      }));
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
