import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { AutoSubscribeOrWatchStoryService } from '../../../../../shared/services/auto-subscribe-watch-story.service';
import { Subject } from 'rxjs';
import { MassFollowingSettings, Condition } from 'src/app/com/annaniks/lift/core/models/account';
import { takeUntil } from 'rxjs/operators';
import { SubscriptionParam } from 'src/app/com/annaniks/lift/core/models/subscription-parameter';
import { ActivatedRoute } from '@angular/router';

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
  public isAutosubscribe: boolean = false;
  public statisticsRoute: string;

  constructor(
    private _fb: FormBuilder,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.isAutosubscribe = this._activatedRoute.snapshot.data.type == 'subscribe';
    this.statisticsRoute = (this.isAutosubscribe) ? '/statistics/subscribers' : '/statistics/preview'
  }

  ngOnInit() {
    this._initForm();
    this._handleMassFollowingSettingsEvent();
    this._bindValues();
  }

  private _handleMassFollowingSettingsEvent(): void {
    this._autoSubscribeOrWatchStoryService.settingsState
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((settings: MassFollowingSettings) => {
        if (settings) {
          this.conditions = [];
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
          this._autoSubscribeOrWatchStoryService.addedConditions = this.conditions;
        }
        else {
          this.conditions = [];
        }
      })
  }

  private _initForm(): void {
    this.suitableSubsOrStoryForm = this._fb.group({
      maximumPerDay: [10],
      maximumPerHour: [10],
      publicationTimeLimit: [false]
    })
    this.suitableSubsOrStoryForm.get('maximumPerDay').valueChanges
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        this._autoSubscribeOrWatchStoryService.settings.subscribesPerDay = Number(data);

      })
    this.suitableSubsOrStoryForm.get('maximumPerHour').valueChanges
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        this._autoSubscribeOrWatchStoryService.settings.subscribesPerHour = Number(data);
      })
  }

  public onChange($event, control: AbstractControl, time: string): void {
    if (time == 'day') {
      this._autoSubscribeOrWatchStoryService.settings.subscribesPerDay = $event.value
    } else {
      this._autoSubscribeOrWatchStoryService.settings.subscribesPerHour = $event.value
    }
    control.patchValue($event.value, { emitEvent: false });
  }

  private _bindValues(): void {
    this._autoSubscribeOrWatchStoryService.getSettingsByType('subscribesPerDay')
      .pipe(
        takeUntil(this._unsubscribe$),
      )
      .subscribe((subscribePerDay: number) => {
        if (subscribePerDay) {
          this.suitableSubsOrStoryForm.patchValue({
            maximumPerDay: this._autoSubscribeOrWatchStoryService.settings.subscribesPerDay || 0,
            maximumPerHour: this._autoSubscribeOrWatchStoryService.settings.subscribesPerHour || 0
          })
        }
      })
  }

  public onTypeChanged($event: SubscriptionParam, index: number): void {
    this.conditions[index].type = $event;
  }

  public onClickAddCondition(): void {
    this.conditions.push({ type: '' })
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
