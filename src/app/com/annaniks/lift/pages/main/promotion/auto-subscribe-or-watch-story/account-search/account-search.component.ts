import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountSearchParam } from '../../../../../core/models/subscription-parameter';
import { SubSink } from 'subsink';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { Search, SearchTerm } from 'src/app/com/annaniks/lift/core/models/search';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-search',
  templateUrl: './account-search.component.html',
  styleUrls: ['./account-search.component.scss']
})
export class AccountSearchComponent implements OnInit {

  @Input('type') public type: AccountSearchParam;

  @Output('searched')
  private _searched = new EventEmitter<SearchTerm>();

  @Input('searchValue')
  public searchValue: Observable<Search>

  public accounts: string[];

  private _subs = new SubSink();

  constructor(
    private _subscribeStoryService: AutoSubscribeOrWatchStoryService
  ) { }

  ngOnInit() {
  }

  public search(event): void {
    this._searched.emit({ type: "user", query: event.query })
  }

  public clearAll(): void {
    this.accounts = []
  }

  public writeValueToService(): void {
    switch (this.type) {
      case "comment":
        this._subscribeStoryService.commentTo = this.accounts
        break;
      case "likes":
        this._subscribeStoryService.likesTo = this.accounts
        break;
      case "subscriber":
        this._subscribeStoryService.subscribesTo = this.accounts
        break;
    }
  }

}
