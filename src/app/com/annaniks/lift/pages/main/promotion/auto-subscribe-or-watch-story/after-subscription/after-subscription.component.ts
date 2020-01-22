import { Component, OnInit, OnDestroy, Input } from '@angular/core';

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

  @Input('massData')
  set _massData(event) {
    this._initForm();

    if (event) {
      this._bindMassfollowing(event)
    }
  }


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
  }

  private _initForm(): void {
    this.afterSubscriptionForm = this._formBuilder.group({
      lastPostLikes: this._formBuilder.group({ status: false, count: 0 }),
      unfollowDays: this._formBuilder.group({ status: false, count: 0 }),
      hidePostsAndStories: false,
      dontFollowHiddenAccounts: false,
      seeStories: false
    })
    this.afterSubscriptionForm.valueChanges.subscribe((data) => {
      let formValue = this.afterSubscriptionForm.value
      this._autoSubscribeOrWatchStoryService.settings.dontFollowHiddenAccounts = formValue.dontFollowHiddenAccounts
      this._autoSubscribeOrWatchStoryService.settings.seeStories = formValue.seeStories
      this._autoSubscribeOrWatchStoryService.settings.hidePostsAndStories = formValue.hidePostsAndStories
      this._autoSubscribeOrWatchStoryService.settings.unfollowDays = formValue.unfollowDays.count
      this._autoSubscribeOrWatchStoryService.settings.dontFollowHiddenAccounts = formValue.dontFollowHiddenAccounts
    })
  }

  private _bindMassfollowing(event): void {
    this.afterSubscriptionForm.patchValue({
      lastPostLikes: false,
      unfollowDays: { status: event.unfollowDays ? true : false, count: event.unfollowDays },
      hidePostsAndStories: event.hidePostsAndStories ? true : false,
      dontFollowHiddenAccounts: event.dontFollowHiddenAccounts ? true : false,
      seeStories: event.seeStories ? true : false
    });
  }

  ngOnDestroy() {
    this._subs.unsubscribe()
  }
}
