import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmptyResponse } from '../../core/models/empty-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BasicUser } from '../../core/models/basic-user';
import { ServerResponse } from '../../core/models/server-response';
import { LoginData } from '../../core/models/login';

@Injectable()
export class AuthService {

    constructor(
        private _httpClient: HttpClient
    ) { }

    public login(loginData: LoginData): Observable<ServerResponse<any>> {
        let params: HttpParams = new HttpParams()
        params = params.set('authorization', 'false')
        return this._httpClient.post<ServerResponse<any>>('login', loginData);
    }

    public register(user: BasicUser): Observable<ServerResponse<EmptyResponse>> {
        let params: HttpParams = new HttpParams()
        params = params.set('authorization', 'false')
        return this._httpClient.post<ServerResponse<EmptyResponse>>('registration', user)
    }
}