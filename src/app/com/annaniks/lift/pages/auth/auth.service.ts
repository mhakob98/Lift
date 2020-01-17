import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmptyResponse } from '../../core/models/empty-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BasicUser } from '../../core/models/basic-user';
import { ServerResponse } from '../../core/models/server-response';
import { LoginData } from '../../core/models/login';
import { TokenResponse } from '../../core/models/auth';

@Injectable()
export class AuthService {

    constructor(
        private _httpClient: HttpClient
    ) { }

    public login(loginData: LoginData): Observable<ServerResponse<TokenResponse>> {
        let params: HttpParams = new HttpParams()
        params = params.set('authorization', 'false');
        return this._httpClient.post<ServerResponse<TokenResponse>>('login', loginData);
    }

    public register(user: BasicUser): Observable<ServerResponse<TokenResponse>> {
        let params: HttpParams = new HttpParams()
        params = params.set('authorization', 'false');
        return this._httpClient.post<ServerResponse<TokenResponse>>('registration', user)
    }
}