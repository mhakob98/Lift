import { Component, OnInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { MainService } from '../../pages/main/main.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ServerResponse } from '../../core/models/server-response';
import { User, InstagramAccount } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { ArticleShort } from '../../core/models/article';

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
  public leftMenuOpened: boolean = false;
  public rightMenuOpened: boolean = false;
  public user: User;
  public localImage: string = 'assets/images/user.png';
  public userAccounts: InstagramAccount[] = [];
  public selectedAccount: InstagramAccount;
  public articles: ArticleShort[] = [];

  constructor(
    private _authService: AuthService,
    private _mainService: MainService,
    private _router: Router,
    private _cookieService: CookieService,
    @Inject('FILE_URL') private _fileUrl: string
  ) { }

  ngOnInit() {
    this._getUser();
    this._getArticles();
  }

  private _getUser(): void {
    this._authService.getUserState()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        if (!!data) {
          this.user = data;
          this.localImage = (this.user && this.user.avatar) ? `${this._fileUrl}/${this.user.avatar}` : 'assets/images/user.png';
          this.userAccounts = this.user.instagramAccounts;
          this.selectedAccount = (this.userAccounts.length > 0) ? this.userAccounts[0] : null;
        }
      })
  }

  private _getArticles(): void {
    this._mainService.getArticles()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        this.articles = data.data;
      })
  }

  public onClickLogOut(): void {
    this._mainService.logOut()
      .pipe(
        takeUntil(this._unsubscribe$),
        finalize(() => {
          this._cookieService.removeAll();
          this._router.navigate(['/auth/login']);
        })
      )
      .subscribe()
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

  public toggleLeftMenu(): void {
    this.leftMenuOpened = !this.leftMenuOpened
    this.rightMenuOpened = false
  }

  public toggleRightMenu(): void {
    this.rightMenuOpened = !this.rightMenuOpened
    this.leftMenuOpened = false
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 900) {
      this.leftMenuOpened = false;
      this.rightMenuOpened = false;
    }
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
