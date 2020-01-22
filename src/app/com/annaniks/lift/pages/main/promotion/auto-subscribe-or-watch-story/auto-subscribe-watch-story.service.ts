import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJs 
import { catchError, map } from 'rxjs/operators';
import { of, Observable, Subject, BehaviorSubject } from 'rxjs';
// Interfaces
import { AudienceFilter } from '../../../../core/models/audience-filter';
import { ActionAfterSubscription } from '../../../../core/models/action-after-subscription';
import { EmptyResponse } from '../../../../core/models/empty-response';
import { ServerResponse } from '../../../../core/models/server-response';
import { Search, SearchTerm } from '../../../../core/models/search';
import { AuthService } from '../../../../core/services/auth.service';
import { AccountSettings } from '../../../../core/models/account';

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
        this.settings.loginId = this._authService.getAccount().id;
        return this.httpClient.post<ServerResponse<EmptyResponse>>('massfollowing', this.settings)
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

    get settingsState(): Observable<AccountSettings> {
        return this._settingsEvent$.asObservable();
    }
}