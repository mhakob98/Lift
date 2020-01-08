import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { ActionAfterSubscription } from '../../../../../core/models/action-after-subscription';

import { Subject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-after-subscription',
  templateUrl: './after-subscription.component.html',
  styleUrls: ['./after-subscription.component.scss']
})
export class AfterSubscriptionComponent implements OnInit, OnDestroy {

  private _subs = new SubSink();
  public afterSubscriptionForm: FormGroup;
  private _actions: ActionAfterSubscription[];


  constructor(
    private _formBuilder: FormBuilder,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService
  ) {
    this._actions = []
  }

  ngOnInit() {
    this._initForm();
    this._fetchAllActions()
  }

  private _initForm(): void {
    this.afterSubscriptionForm = this._formBuilder.group({
      actions: this._formBuilder.array([])
    })
  }

  private _fetchAllActions(): void {
    this._subs.add(
      this._autoSubscribeOrWatchStoryService.fetchAllActions$.
        pipe(
          tap((actions: ActionAfterSubscription[]) => {
            actions.map((action: ActionAfterSubscription) => {
              this._addAction(action);
            })
          }),
          catchError(of)
        ).subscribe()
    )

  }

  private _addAction(action: ActionAfterSubscription): void {
    this._actions.push(action);
    this.actionsGetter.push(this._formBuilder.control(action));
  }

  get actionsGetter() {
    return this.afterSubscriptionForm.get('actions') as FormArray;
  }

  ngOnDestroy() {
    this._subs.unsubscribe()
  }
}
