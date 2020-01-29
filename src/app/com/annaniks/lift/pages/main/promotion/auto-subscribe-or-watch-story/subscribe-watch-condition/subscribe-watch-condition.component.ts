import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { SubscriptionParam } from '../../../../../core/models/subscription-parameter';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { startWith, pairwise, map } from 'rxjs/operators';
import { SearchTerm, Search } from '../../../../../core/models/search';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscribe-watch-condition',
  templateUrl: './subscribe-watch-condition.component.html',
  styleUrls: ['./subscribe-watch-condition.component.scss']
})
export class SubscribeWatchConditionComponent implements OnInit {
  private _selectedType: SubscriptionParam = '';
  @Input()
  public index: number;
  @Input('selectedType')
  set selectedType($event: SubscriptionParam) {
    if ($event != this._selectedType) {
      this._selectedType = $event;
      this.typeControl.patchValue($event);
    }
  }
  @Output('typeChanges') private _typeChanges: EventEmitter<SubscriptionParam> = new EventEmitter<SubscriptionParam>();
  private _subscribe$: Subscription = new Subscription();
  public typeControl: FormControl = new FormControl('');
  public searchStream$: Observable<Search>;
  public isAutosubscribe: boolean = false;

  constructor(
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService,
    private _router: Router,

  ) {
    this.isAutosubscribe = this._router.url != '/promotion/auto-watch-story'
  }


  ngOnInit() {
    this._takeTypeControlValue();
    this._subscribeToTypeChanges();
    this._compareTypeControlValues();
  }

  private _takeTypeControlValue(): void {
    this._subscribe$ = this.typeControl.valueChanges.subscribe((value: SubscriptionParam) => {
      this._selectedType = value;
      this._typeChanges.emit(value);
    })
  }

  private _compareTypeControlValues(): void {
    this.typeControl.valueChanges.pipe(startWith(null), pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        this._autoSubscribeOrWatchStoryService.addedConditionsSubject$.next({ prev, next })
      })
  }

  public checkConditionDisable(type: string): boolean {
    let isExist: boolean = false;

    this._autoSubscribeOrWatchStoryService.addedConditions.map((condition: { type: string }) => {
      if (condition.type === type) isExist = true;
    })
    return isExist ? true : false;
  }

  private _subscribeToTypeChanges(): void {
    this._autoSubscribeOrWatchStoryService.addedConditionsObservable$.subscribe((data: any) => {
      if (!this._autoSubscribeOrWatchStoryService.addedConditions.includes(data.next)) {
        this._autoSubscribeOrWatchStoryService.addedConditions.push(data.next);
      };
      if (this._autoSubscribeOrWatchStoryService.addedConditions.includes(data.prev)) {
        let index = this._autoSubscribeOrWatchStoryService.addedConditions.indexOf(data.prev)
        this._autoSubscribeOrWatchStoryService.addedConditions.splice(index, 1)
      };
    })
  }


  public searchFor(searchTerm: SearchTerm): void {
    this.searchStream$ = this._autoSubscribeOrWatchStoryService.searchFor(searchTerm).pipe(map(search => search.data))
  }

  get selectedType(): SubscriptionParam {
    return this._selectedType;
  }


  ngOnDestroy() {
    this._subscribe$.unsubscribe();
  }

}
