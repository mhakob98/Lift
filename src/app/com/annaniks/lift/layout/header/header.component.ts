import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../pages/main/main.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServerResponse } from '../../core/models/server-response';
import { User, InstagramAccount } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public showNots: boolean = false;
  public showQuestion: boolean = false;
  public showUserDetails: boolean = false;
  public showSwitchAccount: boolean = false;
  public user: User;
  public userAccounts: InstagramAccount[] = [];
  public selectedAccount: InstagramAccount;

  constructor(private _authService: AuthService) {

  }

  ngOnInit() {
    this._getUser();
  }

  private _getUser(): void {
    this._authService.getUserState()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        if (!!data) {
          this.user = data;
          this.userAccounts = this.user.instagramAccounts;
          this.selectedAccount = (this.userAccounts.length > 0) ? this.userAccounts[0] : null;
        }
      })
  }

  public handleSelectAccount($event: InstagramAccount) {
    this.selectedAccount = $event;
    this._authService.setAccount($event);
    this.toggleSwitchAccount();
  }

  public toggleNotsPanel(): void {
    this.showNots = !this.showNots;
  }

  public toggleQuestions(): void {
    this.showQuestion = !this.showQuestion;
  }

  public toggleUserDetails(): void {
    this.showUserDetails = !this.showUserDetails;
  }

  public toggleSwitchAccount(): void {
    this.showSwitchAccount = !this.showSwitchAccount;
  }

  public onClickedOutsideNots(): void {
    this.showNots = false;
  }

  public onClickedOutsideQuestions(): void {
    this.showQuestion = false;
  }

  public onClickedOutsideUserDetails(): void {
    this.showUserDetails = false;
  }

  public onClickedOutsideSwitch(): void {
    this.showSwitchAccount = false;
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
