import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { ServerResponse } from '../../core/models/server-response';
import { EmptyResponse } from '../../core/models/empty-response';
import { User, Account } from '../../core/models/user';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';


@Injectable()
export class MainService {

    constructor(
        private _httpClient: HttpClient,
        private _cookieService: CookieService,
        private _authService: AuthService
    ) { }

    public logOut(): Observable<ServerResponse<EmptyResponse>> {
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + this._cookieService.get('refreshToken'));
        let params = new HttpParams();
        params = params.set('authorization', 'false');
        return this._httpClient.post<ServerResponse<EmptyResponse>>('logout', {}, { headers, params })
    }

    public getMe(): Observable<ServerResponse<User>> {
        return this._httpClient.get<ServerResponse<User>>('me')
            .pipe(
                map((data: ServerResponse<User>) => {
                    this._authService.setUserState(data.data);
                    return data;
                }),
                catchError((err) => {
                    this._authService.setAuthState(null);
                    return throwError(err);
                })
            );
    }

    public addAccount(body: object): Observable<ServerResponse<Account>> {
        return this._httpClient.get<ServerResponse<Account>>('', body);
    }
}