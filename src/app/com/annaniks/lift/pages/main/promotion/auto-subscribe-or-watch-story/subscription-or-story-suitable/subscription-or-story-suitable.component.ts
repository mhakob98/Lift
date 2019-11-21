import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';

import { Hashtag } from '../../../../../core/models/hashtag';
import { Account } from '../../../../../core/models/account';
import { ServerResponse } from 'src/app/com/annaniks/lift/core/models/server-response';

@Component({
  selector: 'app-subscription-suitable',
  templateUrl: './subscription-or-story-suitable.component.html',
  styleUrls: ['./subscription-or-story-suitable.component.scss']
})
export class SubscriptionOrStorySuitableComponent implements OnInit, OnDestroy {

  public suitableSubsOrStoryForm: FormGroup;
  public hashtagsStream$: Observable<Hashtag>;
  public accountsSubscribersStream$: Observable<ServerResponse<Account[]>>;
  public locationAccountStream$: Observable<ServerResponse<Account[]>>;
  public commentsToStream$: Observable<ServerResponse<Account[]>>;
  public likesToStream$: Observable<ServerResponse<Account[]>>;
  private _saveSettingsSubscription = new Subscription();
  constructor(
    private _formBuilder: FormBuilder,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService
  ) { }

  ngOnInit() {
    this._initForm();
  }

  private _initForm(): void {
    this.suitableSubsOrStoryForm = this._formBuilder.group({
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

  private _searchForSpecialAccountsSubscribers(): Observable<ServerResponse<Account[]>> {
    return this.suitableSubsOrStoryForm.get('specialAccountsSubscriber').valueChanges.pipe(
      switchMap(term => this._autoSubscribeOrWatchStoryService.searchForSpecialAccountsSubscribers(term))
    )
  }

  private _searchForSpecialLocationAccounts(): Observable<ServerResponse<Account[]>> {
    return this.suitableSubsOrStoryForm.get('specialLocationAccounts').valueChanges.pipe(
      switchMap(term => this._autoSubscribeOrWatchStoryService.searchForSpecialLocationAccounts(term))
    )
  }

  private _searchForCommentsToSpecialUserAccounts(): Observable<ServerResponse<Account[]>> {
    return this.suitableSubsOrStoryForm.get('commentsToSpecialAccount').valueChanges.pipe(
      switchMap(term => this._autoSubscribeOrWatchStoryService.searchForSpecialLocationAccounts(term))
    )
  }

  private _searchForLikesToSpecialUserAccounts(): Observable<ServerResponse<Account[]>> {
    return this.suitableSubsOrStoryForm.get('likesToSpecialAccount').valueChanges.pipe(
      switchMap(term => this._autoSubscribeOrWatchStoryService.searchForCommentsToSpecialUserAccounts(term))
    )
  }

  public onSettingsSave(): void {
    const settings = this.suitableSubsOrStoryForm.value;
    this._saveSettingsSubscription = this._autoSubscribeOrWatchStoryService.saveSettings(settings).subscribe(() => {

    })
  }

  ngOnDestroy() {
    this._saveSettingsSubscription.unsubscribe();
  }
}
