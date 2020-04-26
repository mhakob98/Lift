import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { InstagramAccount, InstagramAccountStatistics } from '../../../core/models/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public activeAccount: InstagramAccount = {} as InstagramAccount;
  public statistics: InstagramAccountStatistics;
  public localImage: string = '/assets/images/user.png';

  constructor(private _authService: AuthService) {
  }

  ngOnInit() {
    this._authService.getActiveAccount()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        this.activeAccount = data;
        this.statistics = this.activeAccount.statistica;
        this.localImage = (this.activeAccount.avatar) ? this.activeAccount.avatar : '/assets/images/user.png';
      });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
