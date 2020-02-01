import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangePasswordData } from '../../../core/models/account-basic-settings';

@Injectable()
export class ProfileService {

    constructor(private _httpClient: HttpClient) { }

    public changePassword(data: ChangePasswordData): Observable<any> {

        return this._httpClient.post('change-password', data);
    }
}