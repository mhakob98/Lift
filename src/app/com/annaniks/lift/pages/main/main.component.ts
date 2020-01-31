import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from './main.service';
import { Subject, pipe } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AccountConnectionModal } from '../../core/modals';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private _mainService: MainService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit() {
    this._getUser();
  }

  private _getUser(): void {
    this._mainService.getMe()
      .pipe(
        takeUntil(this._unsubscribe),
        pipe(
          map((data) => {
            const user = data.data;
            if (user.instagramAccounts) {
              if (user.instagramAccounts.length === 0) {
                this._openAccountConnectModal();
              }
            }
            else {
              this._openAccountConnectModal();
            }
          })
        )
      )
      .subscribe();
  }

  private _openAccountConnectModal(): void {
    const dialofRef = this._matDialog.open(AccountConnectionModal, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      width: '700px',
      disableClose: true
    })
    dialofRef.afterClosed()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => {
        this._getUser();
      })
  }

  get isShowDisabledView(): boolean {
    return this._mainService.getShowDisabledView();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

}
