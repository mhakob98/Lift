import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { AutoSubscribeService } from '../auto-subscribe.service';
import { ActionAfterSubscription } from '../../../../../core/models/action-after-subscription';

import { Subject, of } from 'rxjs';
import { catchError, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-after-subscription',
  templateUrl: './after-subscription.component.html',
  styleUrls: ['./after-subscription.component.scss']
})
export class AfterSubscriptionComponent implements OnInit, OnDestroy {

  public afterSubscriptionForm: FormGroup;
  private _actions: ActionAfterSubscription[];

  private _unsubscribe$ = new Subject<void>()


  constructor(
    private _formBuilder: FormBuilder,
    private _autoSubscribeService: AutoSubscribeService
  ) { }

  ngOnInit() {
    this._initForm();
    this._fetchAllActions()
    setTimeout(() => {
      console.log(this.afterSubscriptionForm.value);

    }, 5000);
  }

  private _initForm(): void {
    this.afterSubscriptionForm = this._formBuilder.group({
      actions: this._formBuilder.array([])
    })
  }

  private _fetchAllActions(): void {
    this._autoSubscribeService.fetchAllActions$.
      pipe(
        takeUntil(this._unsubscribe$),
        tap((actions: ActionAfterSubscription[]) => {
          actions.map((action: ActionAfterSubscription) => {
            this._addAction(action)
          })
        }),
        catchError(of)
      ).subscribe()
  }

  private _addAction(action: ActionAfterSubscription): void {
    this._actions.push(action);
    this.actionsGetter.push(this._formBuilder.control(action));
  }

  get actionsGetter() {
    return this.afterSubscriptionForm.get('actions') as FormArray;
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete()
  }
}
