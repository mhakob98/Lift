import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from './main.service';
import { Subject, pipe, Observable } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AccountConnectionModal } from '../../core/modals';
import { Router } from '@angular/router';
import { AccountSettings } from '../../core/models/account-settings';
import { ServerResponse } from '../../core/models/server-response';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private _mainService: MainService,
    private _matDialog: MatDialog,
    private _router: Router
  ) { }

  ngOnInit() {
    this._getUser();
  }

  public _getUser(): void {
    let user = {} as User;
    this._mainService.getMe()
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap((data) => {
          user = data.data;
          return this._getAccountSettingsVariants()
        }),
        map((data) => {
          if (user.instagramAccounts) {
            if (user.instagramAccounts.length === 0) {
              this._router.navigate(['']);
              this._openAccountConnectModal();
            }
          }
          else {
            this._router.navigate(['']);
            this._openAccountConnectModal();
          }
        })
      )
      .pipe(

      )
      .subscribe();
  }

  private _getAccountSettingsVariants(): Observable<AccountSettings> {
    return this._mainService.getAccountSettingsVariants()
      .pipe(takeUntil(this._unsubscribe$))
  }

  private _openAccountConnectModal(): void {
    const dialofRef = this._matDialog.open(AccountConnectionModal, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      width: '700px',
      disableClose: true
    })
    dialofRef.afterClosed()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data: { isAccountConnected: boolean }) => {

        if (data && !data.isAccountConnected) {
          this._router.navigate(['/auth/login'])
        }
        this._getUser();
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
