import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJs 
import { map } from 'rxjs/operators';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
// Interfaces
import { EmptyResponse } from '../../../../core/models/empty-response';
import { ServerResponse } from '../../../../core/models/server-response';
import { Search, SearchTerm } from '../../../../core/models/search';
import { AuthService } from '../../../../core/services/auth.service';
import { AccountSettings } from '../../../../core/models/account';
import { SubscriptionParam } from '../../../../core/models/subscription-parameter';

@Injectable()
export class AutoSubscribeOrWatchStoryService {

    private _settingsEvent$ = new BehaviorSubject<AccountSettings>(new AccountSettings());
    public settings: AccountSettings = new AccountSettings();

    public addedConditionsSubject$ = new Subject<{ prev: string, next: string }>();
    public addedConditionsObservable$ = new Observable<{ prev: string, next: string }>();

    public addedConditions: string[] = [];

    constructor(private httpClient: HttpClient, private _authService: AuthService) {
        this.addedConditionsObservable$ = this.addedConditionsSubject$.asObservable();
    }

    public searchFor(searchTerm: SearchTerm): Observable<ServerResponse<Search>> {
        return this.httpClient.get<ServerResponse<Search>>(`instagram-search/${searchTerm.query}/${searchTerm.type}`)
    }

    public saveSettings(): Observable<ServerResponse<EmptyResponse>> {
        const sendingData = {
            loginId: this._authService.getAccount().id.toString(),
            tags: this.settings.tags || [],
            followersByAccounts: this.settings.followersByAccounts || [],
            commentersByAccounts: this.settings.commentersByAccounts || [],
            location: this.settings.location || [],
            likers: this.settings.likers || [],
            seeStories: this.settings.seeStories,
            dontFollowHiddenAccounts: this.settings.dontFollowHiddenAccounts,
            hidePostsAndStories: this.settings.hidePostsAndStories,
            comments: [],
            unfollowDays: this.settings.unfollowDays,
            filter: this.settings.filter
        }
        return this.httpClient.post<ServerResponse<EmptyResponse>>('massfollowing', sendingData)
    }

    public getSettings(activeAccountId: number): Observable<ServerResponse<AccountSettings>> {
        return this.httpClient.get<ServerResponse<AccountSettings>>(`massfollowing/${activeAccountId}`)
            .pipe(
                map((data) => {
                    this.settings = data.data;
                    this._settingsEvent$.next(this.settings);
                    return data;
                })
            )
    }

    public getSettingsByType(type: SubscriptionParam): Observable<any> {
        return this.settingsState
            .pipe(
                map((settings) => settings[type] || [])
            )
    }

    get settingsState(): Observable<AccountSettings> {
        return this._settingsEvent$.asObservable();
    }
}