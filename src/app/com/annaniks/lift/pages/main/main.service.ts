import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { ServerResponse } from '../../core/models/server-response';
import { EmptyResponse } from '../../core/models/empty-response';
import { User } from '../../core/models/user';
import { map, catchError, filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AccountConnectData, TwoFactorLoginData, ChallengeLoginData } from '../../core/models/account';
import { AccountSettings } from '../../core/models/account-settings';
import { JoinTariff } from '../../core/models/tariff';
import { Router } from '@angular/router';
import { AccountContactSettings } from '../../core/models/account-contact-settings';

@Injectable()
export class MainService {
    private _isShowDisabledView: boolean = true;
    private _accountSettingsVariants: AccountSettings = {} as AccountSettings;
    private _accountSettings$: BehaviorSubject<AccountSettings> = new BehaviorSubject<AccountSettings>(null);
    private _accountConnection$: BehaviorSubject<{ isOpen: boolean }> = new BehaviorSubject<{ isOpen: boolean }>(null);

    constructor(
        private _httpClient: HttpClient,
        private _cookieService: CookieService,
        private _authService: AuthService,
        private _router: Router
    ) { }

    public logOut(): Observable<ServerResponse<EmptyResponse>> {
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + this._cookieService.get('refreshToken'));
        let params = new HttpParams();
        params = params.set('authorization', 'false');
        return this._httpClient.post<ServerResponse<EmptyResponse>>('logout', {}, { headers, params });
    }

    public getMe(): Observable<ServerResponse<User>> {
        this.setShowDisabledView(true);
        return this._httpClient.get<ServerResponse<User>>('me')
            .pipe(
                map((data: ServerResponse<User>) => {
                    const user = data.data;
                    if (user) {
                        if (user.instagramAccounts && user.instagramAccounts.length === 0) {
                            this.setShowDisabledView(true);
                            this._router.navigate(['']);
                            this._accountConnection$.next({ isOpen: true });
                        }
                        else {
                            this.setShowDisabledView(false);
                        }
                    }
                    else {
                        this._router.navigate(['']);
                        this._accountConnection$.next({ isOpen: true });
                        this.setShowDisabledView(true);
                        return;
                    }
                    this._authService.setUserState(user);
                    if (!this._authService.getAccount() || (this._authService.getAccount() && !this._authService.getAccount().id)) {
                        if (user && user.instagramAccounts && user.instagramAccounts.length > 0) {
                            this._authService.setAccount(user.instagramAccounts[0]);
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

    public getAccountSettingsVariants(): Observable<AccountSettings> {
        return this._httpClient.get<ServerResponse<AccountSettings>>('settings')
            .pipe(
                map((data) => {
                    this._accountSettingsVariants = data.data;
                    this._accountSettings$.next(this._accountSettingsVariants);
                    return data.data;
                })
            )
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

    public deleteInstaAccount(id: number) {
        return this._httpClient.delete(`instagram-connect/${id}`);
    }

    public getShowDisabledView(): boolean {
        return this._isShowDisabledView
    }

    public joinToTariff(data: JoinTariff): Observable<any> {
        return this._httpClient.post('tariff', data);
    }

    public accountSettingsVariants(): Observable<AccountContactSettings> {
        return this._accountSettings$.asObservable();
    }

    get accountSettingsVariantsSync(): AccountSettings {
        return this._accountSettingsVariants;
    }

    get accountConnectionState(): Observable<{ isOpen: boolean }> {
        return this._accountConnection$.asObservable()
            .pipe(
                filter((event) => event != null)
            );
    }

}