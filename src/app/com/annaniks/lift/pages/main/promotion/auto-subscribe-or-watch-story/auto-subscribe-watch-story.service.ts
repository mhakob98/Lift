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

@Injectable()
export class AutoSubscribeOrWatchStoryService {
    private _settingsEvent$ = new BehaviorSubject<AccountSettings>(new AccountSettings());
    public settings: AccountSettings;

    public addedConditionsSubject$ = new Subject<{ prev: string, next: string }>();
    public addedConditionsObservable$ = new Observable<{ prev: string, next: string }>();

    public addedConditions: { type: string }[] = [];

    constructor(private _httpClient: HttpClient, private _authService: AuthService) {
        this.resetSettings();
        this.addedConditionsObservable$ = this.addedConditionsSubject$.asObservable();
    }

    public searchFor(searchTerm: SearchTerm): Observable<ServerResponse<Search>> {
        return this._httpClient.get<ServerResponse<Search>>(`instagram-search/${searchTerm.query.replace(/\#/g, " ") || ''}/${searchTerm.type}`)
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
            comments: this.settings.comments || [],
            unfollowDays: this.settings.unfollowDays,
            filter: this.settings.filter,
            subscribesPerDay: this.settings.subscribesPerDay || 10,
            subscribesPerHour: this.settings.subscribesPerHour || 10

        }
        return this._httpClient.post<ServerResponse<EmptyResponse>>('massfollowing', sendingData)
    }

    public getSettings(activeAccountId: number): Observable<ServerResponse<AccountSettings>> {
        return this._httpClient.get<ServerResponse<AccountSettings>>(`massfollowing/${activeAccountId}`)
            .pipe(
                map((data) => {
                    if (data && data.data) {
                        this.settings = data.data;
                    }
                    else {
                        this.settings = new AccountSettings();
                    }
                    this._settingsEvent$.next(this.settings);
                    return data;
                })
            )
    }

    public getSettingsByType(type: string): Observable<any> {
        return this.settingsState
            .pipe(
                map((settings) => settings[type] || [])
            )
    }

    public resetSettings(): void {
        this.settings = new AccountSettings();
        this._settingsEvent$.next(this.settings);
    }

    get settingsState(): Observable<AccountSettings> {
        return this._settingsEvent$.asObservable();
    }
}