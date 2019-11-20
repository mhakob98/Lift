import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AutoSubscribeService } from '../auto-subscribe.service';

import { Hashtag } from '../../../../../core/models/hashtag';
import { Account } from '../../../../../core/models/account';

@Component({
  selector: 'app-subscription-suitable',
  templateUrl: './subscription-suitable.component.html',
  styleUrls: ['./subscription-suitable.component.scss']
})
export class SubscriptionSuitableComponent implements OnInit {

  public suitableSubsForm: FormGroup;
  public hashtagsStream$: Observable<Hashtag>;
  public accountsSubscribersStream$: Observable<Account[]>;
  public locationAccountStream$: Observable<Account[]>;
  public commentsToStream$: Observable<Account[]>;
  public likesToStream$: Observable<Account[]>;

  constructor(
    private _formBuilder: FormBuilder,
    private _autoSubscribeService: AutoSubscribeService
  ) { }

  ngOnInit() {
    this._initForm();
  }

  private _initForm(): void {
    this.suitableSubsForm = this._formBuilder.group({
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
    return this.suitableSubsForm.get('hashtags').valueChanges.pipe(
      switchMap(term => this._autoSubscribeService.searchForHashtags(term))
    )
  }

  private _searchForSpecialAccountsSubscribers(): Observable<Account[]> {
    return this.suitableSubsForm.get('specialAccountsSubscriber').valueChanges.pipe(
      switchMap(term => this._autoSubscribeService.searchForSpecialAccountsSubscribers(term))
    )
  }

  private _searchForSpecialLocationAccounts(): Observable<Account[]> {
    return this.suitableSubsForm.get('specialLocationAccounts').valueChanges.pipe(
      switchMap(term => this._autoSubscribeService.searchForSpecialLocationAccounts(term))
    )
  }

  private _searchForCommentsToSpecialUserAccounts(): Observable<Account[]> {
    return this.suitableSubsForm.get('commentsToSpecialAccount').valueChanges.pipe(
      switchMap(term => this._autoSubscribeService.searchForSpecialLocationAccounts(term))
    )
  }

  private _searchForLikesToSpecialUserAccounts(): Observable<Account[]> {
    return this.suitableSubsForm.get('likesToSpecialAccount').valueChanges.pipe(
      switchMap(term => this._autoSubscribeService.searchForCommentsToSpecialUserAccounts(term))
    )
  }
}
