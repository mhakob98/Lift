import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Hashtag } from '../../../../core/models/hashtag';
import { AudienceFilter } from '../../../../core/models/audience-filter';
import { ActionAfterSubscription } from '../../../../core/models/action-after-subscription';

@Injectable()
export class AutoSubscribeService {

    public fetchAllFilters$ = this.httpClient.get<AudienceFilter[]>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(catchError(of))

    public fetchAllActions$ = this.httpClient.get<ActionAfterSubscription[]>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(catchError(of))


    public searchForHashtags(term: string): Observable<any[]> {
        return this.httpClient.get<any[]>('/search/hashtag', { params: { query: term } })
    }

    public searchForSpecialAccountsSubscribers(term: string): Observable<Account[]> {
        return this.httpClient.get<Account[]>('/search/account-subscribers', { params: { query: term } })
    }

    public searchForSpecialLocationAccounts(term: string): Observable<Account[]> {
        return this.httpClient.get<Account[]>('/search/location-accounts', { params: { query: term } })
    }

    public searchForCommentsToSpecialUserAccounts(term: string): Observable<Account[]> {
        return this.httpClient.get<Account[]>('/search/comments-to-accounts', { params: { query: term } })
    }

    public searchForLikesToSpecialUserAccounts(term: string): Observable<Account[]> {
        return this.httpClient.get<Account[]>('/search/likes-to-accounts', { params: { query: term } })
    }

    constructor(private httpClient: HttpClient) { }

}