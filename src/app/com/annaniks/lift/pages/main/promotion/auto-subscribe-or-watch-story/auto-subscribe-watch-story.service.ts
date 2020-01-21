import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJs 
import { catchError } from 'rxjs/operators';
import { of, Observable, BehaviorSubject, Subject } from 'rxjs';
// Interfaces
import { AudienceFilter } from '../../../../core/models/audience-filter';
import { ActionAfterSubscription } from '../../../../core/models/action-after-subscription';
import { EmptyResponse } from '../../../../core/models/empty-response';
import { ServerResponse } from '../../../../core/models/server-response';
import { Search, SearchTerm } from '../../../../core/models/search';
import { AuthService } from '../../../../core/services/auth.service';

@Injectable()
export class AutoSubscribeOrWatchStoryService {
    public selectedSubscribes = []
    public settings: any = {
        "likeCountForFollower": 2,
        "seeStories": true,
        "dontFollowHiddenAccounts": false,
        "hidePostsAndStories": true,
        "comments": [],
        "hidePosts": true,
        "hideStories": false,
        "unfollowDays": 5,
        "followTime": {
            "start": "02-05-2020",
            "end": "10-10-2020"
        },
    }
    public addedConditionsSubject$ = new Subject<{ prev: string, next: string }>();
    public addedConditionsObservable$ = new Observable<{ prev: string, next: string }>();

    public addedConditions: string[] = []

    public fetchAllFilters$ = this.httpClient.get<ServerResponse<AudienceFilter[]>>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(catchError(of))

    public fetchAllActions$ = this.httpClient.get<ServerResponse<ActionAfterSubscription[]>>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(catchError(of))



    constructor(private httpClient: HttpClient, private _authService: AuthService) {
        this.addedConditionsObservable$ = this.addedConditionsSubject$.asObservable();
    }

    public searchFor(searchTerm: SearchTerm): Observable<ServerResponse<Search>> {
        return this.httpClient.get<ServerResponse<Search>>(`instagram-search/${searchTerm.query}/${searchTerm.type}`)
    }

    public saveSettings(): Observable<ServerResponse<EmptyResponse>> {
        this.settings.loginId = this._authService.getAccount().id.toString()
        return this.httpClient.post<ServerResponse<EmptyResponse>>('massfollowing', this.settings)
    }

    // TODO NEEDS TYPING
    public getSettings(activeAccountId: number): Observable<ServerResponse<any>> {
        return this.httpClient.get<ServerResponse<any>>(`massfollowing/${activeAccountId}`)
    }
}