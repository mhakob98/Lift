import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from './main.service';
import { Subject, Observable, forkJoin } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AccountConnectionModal } from '../../core/modals';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { AccountSettings } from '../../core/models/account-settings';
import { User } from '../../core/models/user';
import { ToastrService } from 'ngx-toastr';

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

  public _getUser(): Observable<User> {
    return this._mainService.getMe()
      .pipe(
        map((data) => {
          this._user = data.data;
          return data.data;
        })
      )
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
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data: { isAccountConnected: boolean }) => {
        if (data && data.isAccountConnected) {
          this._getUser().subscribe();
        }
        else if (!this._user || (this._user.instagramAccounts && this._user.instagramAccounts.length == 0)) {
          this._router.navigate(['/auth/login'])
        }
      })
  }


  get isShowDisabledView(): boolean {
    return this._mainService.getShowDisabledView();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
