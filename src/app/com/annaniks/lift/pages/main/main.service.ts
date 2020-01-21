import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { ServerResponse } from '../../core/models/server-response';
import { EmptyResponse } from '../../core/models/empty-response';
import { User } from '../../core/models/user';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountConnectData, TwoFactorLoginData } from '../../core/models/account';

@Injectable()
export class MainService {
    private _isShowDisabledView: boolean = false;

    constructor(
        private _httpClient: HttpClient,
        private _cookieService: CookieService,
        private _authService: AuthService,
        private _matDialog: MatDialog
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
                        if (user.istagramAccounts && user.istagramAccounts.length === 0) {
                            this.setShowDisabledView(true);
                        }
                        else {
                            this.setShowDisabledView(false);
                        }
                    }
                    else {
                        this.setShowDisabledView(false);
                    }
                    this._authService.setUserState(data.data);
                    return data;
                }),
                catchError((err) => {
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


    public getShowDisabledView(): boolean {
        return this._isShowDisabledView;
    }


    public postAccountConnectionValues(body): Observable<any> {
        return this._httpClient.post('', body);
    }

}