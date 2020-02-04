import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { ServerResponse } from '../../core/models/server-response';
import { EmptyResponse } from '../../core/models/empty-response';
import { User } from '../../core/models/user';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AccountConnectData, TwoFactorLoginData, ChallengeLoginData } from '../../core/models/account';

@Injectable()
export class MainService {
    private _isShowDisabledView: boolean = true;

    constructor(
        private _httpClient: HttpClient,
        private _cookieService: CookieService,
        private _authService: AuthService,
    ) { }

    public logOut(): Observable<ServerResponse<EmptyResponse>> {
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + this._cookieService.get('refreshToken'));
        let params = new HttpParams();
        params = params.set('authorization', 'false');
        return this._httpClient.post<ServerResponse<EmptyResponse>>('logout', {}, { headers, params });
    }

    public getMe(): Observable<ServerResponse<User>> {
        return this._httpClient.get<ServerResponse<User>>('me')
            .pipe(
                map((data: ServerResponse<User>) => {
                    const user = data.data;
                    if (user) {
                        if (user.instagramAccounts && user.instagramAccounts.length === 0) {
                            this.setShowDisabledView(true);
                        }
                        else {
                            this.setShowDisabledView(false);
                        }
                    }
                    else {
                        this.setShowDisabledView(true);
                        return;
                    }
                    this._authService.setUserState(user);
                    if (!this._authService.getAccount() || (this._authService.getAccount() && !this._authService.getAccount().id)) {
                        if (user && user.instagramAccounts && user.instagramAccounts.length > 0) {
                            this._authService.setAccount(user.instagramAccounts[0])
                        }
                    }
                    return data;
                }),
                catchError((err) => {
                    this.setShowDisabledView(true);
                    this._authService.setAuthState(null);
                    return throwError(err);
                })
            );
    }

    public setShowDisabledView(isShow: boolean): void {
        this._isShowDisabledView = isShow;
        if (isShow) {
            window.scrollTo(0, 0);
            document.body.style.overflow = 'hidden';
            return;
        }
        document.body.style.overflow = 'auto';
    }

    public accountConnect(data: AccountConnectData): Observable<any> {
        return this._httpClient.post('instagram-connect', data);
    }

    public twoFactorLogin(data: TwoFactorLoginData): Observable<any> {
        return this._httpClient.post('two-factor-login', data);
    }

    public challengeLogin(data: ChallengeLoginData): Observable<any> {
        return this._httpClient.post('checkpoint-challenge', data);
    }

    public getShowDisabledView(): boolean {
        return this._isShowDisabledView;
    }

}