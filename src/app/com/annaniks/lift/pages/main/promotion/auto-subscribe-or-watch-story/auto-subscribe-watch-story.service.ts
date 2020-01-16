import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJs 
import { catchError } from 'rxjs/operators';
import { of, Observable, BehaviorSubject, Subject } from 'rxjs';
// Interfaces
import { AudienceFilter } from '../../../../core/models/audience-filter';
import { ActionAfterSubscription } from '../../../../core/models/action-after-subscription';
import { SuitableSettingsRequest } from '../../../../core/models/suitable-settings-request';
import { EmptyResponse } from '../../../../core/models/empty-response';
import { ServerResponse } from '../../../../core/models/server-response';
import { Hashtag } from '../../../../core/models/hashtag';
import { Account } from '../../../../core/models/account';
import { Coordinates } from '../../../../core/models/coordinates';

@Injectable()
export class AutoSubscribeOrWatchStoryService {

    public hashtagSubject$ = new BehaviorSubject<string[]>([])
    public locationSubject$ = new BehaviorSubject<Coordinates[]>([])
    public subscribeToSubject$ = new BehaviorSubject<string[]>([])
    public saveSettingsSubject$ = new Subject<void>()
    public addedConditionsSubject$ = new Subject<{ prev: string, next: string }>()
    public hashtagObservable$ = new Observable<string[]>()
    public locationObservable$ = new Observable<Coordinates[]>()
    public subscribeToObservable$ = new Observable<string[]>()
    public saveSettingsObservable$ = new Observable<void>()
    public addedConditionsObservable$ = new Observable<{ prev: string, next: string }>()

    public addedConditions: string[] = []

    public fetchAllFilters$ = this.httpClient.get<ServerResponse<AudienceFilter[]>>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(catchError(of))

    public fetchAllActions$ = this.httpClient.get<ServerResponse<ActionAfterSubscription[]>>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(catchError(of))


    public searchForHashtags(term: string): Observable<ServerResponse<Hashtag[]>> {
        return this.httpClient.get<ServerResponse<Hashtag[]>>('/search/hashtag', { params: { query: term } })
    }

    public searchForSpecialAccountsSubscribers(term: string): Observable<ServerResponse<Account[]>> {
        return this.httpClient.get<ServerResponse<Account[]>>('/search/account-subscribers', { params: { query: term } })
    }

    public searchForSpecialLocationAccounts(term: string): Observable<ServerResponse<Account[]>> {
        return this.httpClient.get<ServerResponse<Account[]>>('/search/location-accounts', { params: { query: term } })
    }

    public searchForCommentsToSpecialUserAccounts(term: string): Observable<ServerResponse<Account[]>> {
        return this.httpClient.get<ServerResponse<Account[]>>('/search/comments-to-accounts', { params: { query: term } })
    }

    public searchForLikesToSpecialUserAccounts(term: string): Observable<ServerResponse<Account[]>> {
        return this.httpClient.get<ServerResponse<Account[]>>('/search/likes-to-accounts', { params: { query: term } })
    }

    public saveSettings(settings: SuitableSettingsRequest): Observable<ServerResponse<EmptyResponse>> {
        return this.httpClient.post<ServerResponse<EmptyResponse>>('/save/settings', settings)
    }

    constructor(private httpClient: HttpClient) {
        this.hashtagObservable$ = this.hashtagSubject$.asObservable()
        this.subscribeToObservable$ = this.subscribeToSubject$.asObservable()
        this.locationObservable$ = this.locationSubject$.asObservable()
        this.saveSettingsObservable$ = this.saveSettingsSubject$.asObservable()
        this.addedConditionsObservable$ = this.addedConditionsSubject$.asObservable()
    }

}