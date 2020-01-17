import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../../../pages/main/main.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss']
})
export class HeaderUserComponent implements OnInit,OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public showUserDetails: boolean = false;

  constructor(
    private _mainService: MainService,
    private _cookieService: CookieService,
    private _router: Router
  ) { }

  ngOnInit() { }

  public onClickLogOut(): void {
    this._mainService.logOut()
      .pipe(
        takeUntil(this._unsubscribe$),
        finalize(()=>{
          this._cookieService.removeAll();
          this._router.navigate(['/auth/login']);
        })
      )
      .subscribe()
  }

  ngOnDestroy(){
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
