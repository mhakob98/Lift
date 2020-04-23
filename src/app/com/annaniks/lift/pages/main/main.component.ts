import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from './main.service';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AccountConnectionModal } from '../../core/modals';
import { Router } from '@angular/router';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  private _user: User = {} as User;
  private _unsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    private _mainService: MainService,
    private _matDialog: MatDialog,
    private _router: Router,
  ) {
    this._resetMainProperties();
  }

  ngOnInit() {
    this._handleAccountConnectEvent();
    this._mainService.fetchMainData();
  }

  private _handleAccountConnectEvent(): void {
    this._mainService.accountConnectionState
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        if (data && data.isOpen) {
          const accountData = data.accountData || {};
          this._openAccountConnectModal(accountData);
        }
      })
  }

  private _resetMainProperties(): void {
    this._mainService.resetMainProperties();
  }

  private _openAccountConnectModal(accountData?: any): void {
    const dialofRef = this._matDialog.open(AccountConnectionModal, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      width: '700px',
      disableClose: true,
      data: accountData
    })
    dialofRef.afterClosed()
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap((data) => {
          if (data && data.isAccountConnected) {
            return this._getUser();
          }
          else if (!this._user || (this._user.instagramAccounts && this._user.instagramAccounts.length == 0)) {
            this._router.navigate(['/auth/login'])
            return of();
          }
          return of();
        })
      )
      .subscribe()
  }

  private _getUser(): Observable<User> {
    return this._mainService.getMe()
      .pipe(
        map((data) => {
          this._user = data.data;
          return data.data;
        })
      )
  }


  get isShowDisabledView(): boolean {
    return this._mainService.getShowDisabledView();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
