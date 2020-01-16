import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionParam } from 'src/app/com/annaniks/lift/core/models/subscription-parameter';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { startWith, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-subscribe-watch-condition',
  templateUrl: './subscribe-watch-condition.component.html',
  styleUrls: ['./subscribe-watch-condition.component.scss']
})
export class SubscribeWatchConditionComponent implements OnInit {
  @Input()
  public index: number
  private _subscribe$: Subscription = new Subscription();
  public typeControl: FormControl = new FormControl();
  public selectedType: SubscriptionParam = '';


  constructor(
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService
  ) { }


  ngOnInit() {
    this._takeTypeControlValue();
    this._subscribeToTypeChanges();
    this.typeControl.valueChanges.pipe(startWith(null), pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        this._autoSubscribeOrWatchStoryService.addedConditionsSubject$.next({ prev, next })
      })

  }
  private _takeTypeControlValue(): void {
    this._subscribe$ = this.typeControl.valueChanges.subscribe((value: SubscriptionParam) => {
      this.selectedType = value;
    })
  }

  public checkConditionDisable(type: string): boolean {
    let isExist: boolean = false
    this._autoSubscribeOrWatchStoryService.addedConditions.map((condition: string) => {
      if (condition === type) isExist = true
    })
    return isExist ? true : false
  }

  private _subscribeToTypeChanges(): void {
    this._autoSubscribeOrWatchStoryService.addedConditionsObservable$.subscribe((data: any) => {

      if (!this._autoSubscribeOrWatchStoryService.addedConditions.includes(data.next)) {
        this._autoSubscribeOrWatchStoryService.addedConditions.push(data.next)
      };
      if (this._autoSubscribeOrWatchStoryService.addedConditions.includes(data.prev)) {
        let index = this._autoSubscribeOrWatchStoryService.addedConditions.indexOf(data.prev)
        this._autoSubscribeOrWatchStoryService.addedConditions.splice(index, 1)
      };
    })
  }

  ngOnDestroy() {
    this._subscribe$.unsubscribe();
  }

}
