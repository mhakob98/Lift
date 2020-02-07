import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangePasswordData } from '../../../core/models/account-basic-settings';
import { ChangeMe } from '../../../core/models/change-me';

@Injectable()
export class ProfileService {

    constructor(private _httpClient: HttpClient) { }

    public changePassword(data: ChangePasswordData): Observable<any> {
        return this._httpClient.post('change-password', data);
    }

    public changeMe(data: ChangeMe): Observable<any> {
        return this._httpClient.put('me', data)
    }
}