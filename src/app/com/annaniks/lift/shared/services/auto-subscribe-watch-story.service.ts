import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJs 
import { map } from 'rxjs/operators';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
// Interfaces
import { EmptyResponse } from '../../core/models/empty-response';
import { ServerResponse } from '../../core/models/server-response';
import { Search, SearchTerm } from '../../core/models/search';
import { AuthService } from '../../core/services/auth.service';
import { MassFollowingSettings } from '../../core/models/account';

@Injectable()
export class AutoSubscribeOrWatchStoryService {
    private _settingsEvent$ = new BehaviorSubject<MassFollowingSettings>(new MassFollowingSettings());
    public settings: MassFollowingSettings;

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

    public saveSettings(isAutosubscribe: boolean): Observable<ServerResponse<EmptyResponse>> {
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
            subscribesPerDay: this.settings.subscribesPerDay,
            subscribesPerHour: this.settings.subscribesPerHour,
            likeCountForFollower: this.settings.likeCountForFollower

        }
        return this._httpClient.post<ServerResponse<EmptyResponse>>(isAutosubscribe ? 'massfollowing' : 'masslooking', sendingData)
    }

    public getSettings(isAutosubscribe: boolean, activeAccountId: number): Observable<ServerResponse<MassFollowingSettings>> {
        return this._httpClient.get<ServerResponse<MassFollowingSettings>>(isAutosubscribe ? `massfollowing/${activeAccountId}` : `masslooking/${activeAccountId}`)
            .pipe(
                map((data) => {
                    if (data && data.data) {
                        this.settings = data.data;
                    }
                    else {
                        this.settings = new MassFollowingSettings();
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
        this.settings = new MassFollowingSettings();
        this._settingsEvent$.next(this.settings);
    }

    get settingsState(): Observable<MassFollowingSettings> {
        return this._settingsEvent$.asObservable();
    }
}