import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { SubSink } from 'subsink';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { Subject } from 'rxjs';
import { AccountSettings, Condition } from 'src/app/com/annaniks/lift/core/models/account';
import { takeUntil } from 'rxjs/operators';
import { SubscriptionParam } from 'src/app/com/annaniks/lift/core/models/subscription-parameter';

@Component({
  selector: 'app-subscription-suitable',
  templateUrl: './subscription-or-story-suitable.component.html',
  styleUrls: ['./subscription-or-story-suitable.component.scss'],
})
export class SubscriptionOrStorySuitableComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public step: number;
  public suitableSubsOrStoryForm: FormGroup;
  public conditions: Condition[] = [];

  constructor(
    private _fb: FormBuilder,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService
  ) { }

  ngOnInit() {
    this._initForm();
    this._handleAccountSettingsEvent();
  }

  private _handleAccountSettingsEvent(): void {
    this._autoSubscribeOrWatchStoryService.settingsState
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((settings: AccountSettings) => {
        if (settings) {
          if (settings.tags && settings.tags.length > 0) {
            this.conditions.push({ type: 'hashtag' });
          }
          if (settings.followersByAccounts && settings.followersByAccounts.length > 0) {
            this.conditions.push({ type: 'subscriber' });
          }
          if (settings.commentersByAccounts && settings.commentersByAccounts.length > 0) {
            this.conditions.push({ type: 'comment' });
          }
          if (settings.commentersByAccounts && settings.likers.length > 0) {
            this.conditions.push({ type: 'likes' });
          }
          if (settings.location && settings.location.length > 0) {
            this.conditions.push({ type: 'location' });
          }
          console.log(this.conditions);

          this._autoSubscribeOrWatchStoryService.addedConditions = this.conditions

        }

      })
  }

  private _initForm(): void {
    this.suitableSubsOrStoryForm = this._fb.group({
      maximumPerDay: [200],
      maximumPerHour: [20],
      publicationTimeLimit: [false]
    })
  }

  public onChange($event, control: AbstractControl): void {
    control.patchValue($event.value, { emitEvent: false });
  }

  public onTypeChanged($event: SubscriptionParam, index: number): void {
    this.conditions[index].type = $event;
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
