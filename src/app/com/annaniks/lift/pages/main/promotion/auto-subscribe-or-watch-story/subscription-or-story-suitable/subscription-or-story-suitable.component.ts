import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { Hashtag } from '../../../../../core/models/hashtag';
import { Account } from '../../../../../core/models/account';
import { coerceNumberProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-subscription-suitable',
  templateUrl: './subscription-or-story-suitable.component.html',
  styleUrls: ['./subscription-or-story-suitable.component.scss'],
})
export class SubscriptionOrStorySuitableComponent implements OnInit, OnDestroy {

  public suitableSubsOrStoryForm: FormGroup;
  public conditionsForm: FormGroup;
  public conditionsItems: FormArray;
  public hashtagsStream$: Observable<Hashtag>;
  public accountsSubscribersStream$: Observable<Account[]>;
  public locationAccountStream$: Observable<Account[]>;
  public commentsToStream$: Observable<Account[]>;
  public likesToStream$: Observable<Account[]>;
  private _subs = new SubSink();
  public conditions: number[] = []

  constructor(
    private _fb: FormBuilder,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService
  ) { }

  ngOnInit() {
    this._initForm();

  }
  public onSave() {
    this._autoSubscribeOrWatchStoryService.saveSettingsSubject$.next()
  }
  private _initForm(): void {

    this.suitableSubsOrStoryForm = this._fb.group({
      hashtags: [null],
      specialAccountsSubscriber: [null],
      specialLocationAccounts: [null],
      commentsToSpecialAccount: [null],
      likesToSpecialAccount: [null],
      maximumPerDay: [200],
      maximumPerHour: [20],
      publicationTimeLimit: [false]
    })

    this.hashtagsStream$ = this._searchForHashtags();
    this.accountsSubscribersStream$ = this._searchForSpecialAccountsSubscribers();
    this.locationAccountStream$ = this._searchForSpecialLocationAccounts();
    this.commentsToStream$ = this._searchForCommentsToSpecialUserAccounts();
    this.likesToStream$ = this._searchForLikesToSpecialUserAccounts();
  }



  private _searchForHashtags(): Observable<Hashtag> {
    return this.suitableSubsOrStoryForm.get('hashtags').valueChanges.pipe(
      switchMap(term => this._autoSubscribeOrWatchStoryService.searchForHashtags(term))
    )
  }

  private _searchForSpecialAccountsSubscribers(): Observable<Account[]> {
    return this.suitableSubsOrStoryForm.get('specialAccountsSubscriber').valueChanges.pipe(
      switchMap(term => this._autoSubscribeOrWatchStoryService.searchForSpecialAccountsSubscribers(term).pipe(map(term => term.data))))
  }

  private _searchForSpecialLocationAccounts(): Observable<Account[]> {
    return this.suitableSubsOrStoryForm.get('specialLocationAccounts').valueChanges.pipe(
      switchMap(term => this._autoSubscribeOrWatchStoryService.searchForSpecialLocationAccounts(term).pipe(map(term => term.data))))
  }

  private _searchForCommentsToSpecialUserAccounts(): Observable<Account[]> {
    return this.suitableSubsOrStoryForm.get('commentsToSpecialAccount').valueChanges.pipe(
      switchMap(term => this._autoSubscribeOrWatchStoryService.searchForSpecialLocationAccounts(term).pipe(map(term => term.data))))
  }

  private _searchForLikesToSpecialUserAccounts(): Observable<Account[]> {
    return this.suitableSubsOrStoryForm.get('likesToSpecialAccount').valueChanges.pipe(
      switchMap(term => this._autoSubscribeOrWatchStoryService.searchForCommentsToSpecialUserAccounts(term).pipe(map(term => term.data))))
  }

  public onSettingsSave(): void {
    const settings = this.conditionsForm.value;
    this._subs.add(this._autoSubscribeOrWatchStoryService.saveSettings(settings).subscribe(() => {

    }))
  }

  public onChange($event): void {
    this.suitableSubsOrStoryForm.get('maximumPerDay').patchValue($event.value, { emitEvent: false });
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
