import { Component, OnInit, Input } from '@angular/core';
import { AccountSearchParam } from '../../../../../core/models/subscription-parameter';
import { SubSink } from 'subsink';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';

@Component({
  selector: 'app-account-search',
  templateUrl: './account-search.component.html',
  styleUrls: ['./account-search.component.scss']
})
export class AccountSearchComponent implements OnInit {
  @Input('type') public type: AccountSearchParam;
  public texts: string[];

  public results: string[];

  public searchArray: string[] = [
    "barev", "hajox", "Hovo", "Rado", "hakov"
  ]
  private _subs = new SubSink();

  constructor(
    private _subscribeStoryService: AutoSubscribeOrWatchStoryService
  ) { }

  ngOnInit() {
    this._waitForValueEmit()
  }

  public search(event): void {
    this.results = this.searchArray.filter((d) => d.includes(event.query))
  }
  public clearAll(): void {
    this.texts = []
  }

  private _waitForValueEmit(): void {
    this._subs.add(this._subscribeStoryService.saveSettingsObservable$.subscribe(async (data) => {
      console.log(this.results);
      await data
      this._subscribeStoryService.subscribeToSubject$.next(this.results)
    }))
  }
}
