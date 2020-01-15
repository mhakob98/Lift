import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionParam } from 'src/app/com/annaniks/lift/core/models/subscription-parameter';

@Component({
  selector: 'app-subscribe-watch-condition',
  templateUrl: './subscribe-watch-condition.component.html',
  styleUrls: ['./subscribe-watch-condition.component.scss']
})
export class SubscribeWatchConditionComponent implements OnInit {
  private _subscribe$: Subscription = new Subscription();
  public typeControl: FormControl = new FormControl('hashtag');
  public selectedType: SubscriptionParam = 'hashtag';

  constructor() { }

  ngOnInit() {
    this._takeTypeControlValue();
  }

  private _takeTypeControlValue(): void {
    this._subscribe$ = this.typeControl.valueChanges.subscribe((value: SubscriptionParam) => {
      this.selectedType = value;
    })
  }

  ngOnDestroy() {
    this._subscribe$.unsubscribe();
  }

}
