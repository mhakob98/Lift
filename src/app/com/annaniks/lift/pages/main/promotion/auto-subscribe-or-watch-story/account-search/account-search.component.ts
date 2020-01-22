import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountSearchParam } from '../../../../../core/models/subscription-parameter';
import { SubSink } from 'subsink';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { Search, SearchTerm } from 'src/app/com/annaniks/lift/core/models/search';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-account-search',
  templateUrl: './account-search.component.html',
  styleUrls: ['./account-search.component.scss']
})
export class AccountSearchComponent implements OnInit {
  private _unsubscribe: Subject<void> = new Subject<void>();
  @Input('type') public type: AccountSearchParam;
  @Output('searched')
  private _searched = new EventEmitter<SearchTerm>();
  @Input('searchValue')
  public searchValue: Observable<Search>

  public accounts: FormControl = new FormControl([]);

  private _subs = new SubSink();

  constructor(
    private _subscribeStoryService: AutoSubscribeOrWatchStoryService
  ) { }

  ngOnInit() {
    this._checkAccountSearchType();
  }

  private _checkAccountSearchType(): void {
    let accountType: string;
    if (this.type === "subscriber") {
      accountType = 'followersByAccounts';
    }
    if (this.type === 'comment') {
      accountType = 'commentersByAccounts';
    }
    if (this.type === 'likes') {
      accountType = 'likers';
    }
    this._subscribeStoryService.getSettingsByType(accountType)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((data) => {
        console.log(data);
        this.accounts.patchValue(data);
      })
  }

  public search(event): void {
    this._searched.emit({ type: "user", query: event.query })
  }

  public clearAll(): void {
    this.accounts.setValue([]);
  }

  public writeValueToService(): void {
    switch (this.type) {
      case "comment":
        this._subscribeStoryService.settings.commentersByAccounts = this.accounts.value;
        break;
      case "likes":
        this._subscribeStoryService.settings.likers = this.accounts.value;
        break;
      case "subscriber":
        this._subscribeStoryService.settings.followersByAccounts = this.accounts.value;
        break;
    }
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

}
