import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ServerResponse } from '../../../core/models/server-response';
import { EmptyResponse } from '../../../core/models/empty-response';
import { AccountMainSettings } from '../../../core/models/account-main-settings';
import { AccountProfileSettings } from '../../../core/models/account-profile-settings';
import { AccountGoalSettings } from '../../../core/models/account-goal-settings';
import { AccountContactSettings } from '../../../core/models/account-contact-settings';



@Injectable()
export class AccountSettingsService {


    public saveMainSettings(settings: AccountMainSettings): Observable<ServerResponse<EmptyResponse>> {
        return this.httpClient.post<ServerResponse<EmptyResponse>>('account/save/main', settings)
    }

    public saveProfileSettings(settings: AccountProfileSettings): Observable<ServerResponse<EmptyResponse>> {
        return this.httpClient.post<ServerResponse<EmptyResponse>>('account/save/profile', settings)
    }

    public saveGoalSettings(settings: AccountGoalSettings): Observable<ServerResponse<EmptyResponse>> {
        return this.httpClient.post<ServerResponse<EmptyResponse>>('account/save/goal', settings)
    }
    public saveContactSettings(settings: AccountContactSettings): Observable<ServerResponse<EmptyResponse>> {
        return this.httpClient.post<ServerResponse<EmptyResponse>>('account/save/contact', settings)
    }

    constructor(private httpClient: HttpClient) { }

}