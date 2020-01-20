import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from './main.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit,OnDestroy {
  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(private _mainService: MainService) { }

  ngOnInit() {
    this._getUser();
  }

  private _getUser(): void {
    this._mainService.getMe()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe();
  }

  get isShowDisabledView():boolean{
    return this._mainService.getShowDisabledView();
  }

  ngOnDestroy(){
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

}
