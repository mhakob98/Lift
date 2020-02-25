import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subject, forkJoin } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { ServerResponse } from '../../core/models/server-response';
import { EmptyResponse } from '../../core/models/empty-response';
import { User, InstagramAccount } from '../../core/models/user';
import { map, catchError, filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import {
    AccountConnectData,
    TwoFactorLoginData,
    ChallengeLoginData
} from '../../core/models/account';
import {
    ArticleShort
} from '../../core/models/article';
import { AccountSettings } from '../../core/models/account-settings';
import { JoinTariff } from '../../core/models/tariff';
import { Router } from '@angular/router';
import { AccountContactSettings } from '../../core/models/account-contact-settings';
import { ChangeInstagramAccountRequest } from '../../core/models/change-password-recuest';
import { ToastrService } from 'ngx-toastr';
import { VerificationCode } from '../../core/models/verification-code';

@Injectable()
export class MainService {
    private _isShowDisabledView: boolean = true;
    private _accountSettingsVariants: AccountSettings = {} as AccountSettings;
    private _accountSettings$: BehaviorSubject<AccountSettings> = new BehaviorSubject<AccountSettings>(null);
    private _accountConnection$: Subject<{ isOpen: boolean, accountData?: any }> = new Subject<{ isOpen: boolean, accountData?: any }>();

    constructor(
        private _httpClient: HttpClient,
        private _cookieService: CookieService,
        private _authService: AuthService,
        private _router: Router,
        private _toastrService: ToastrService
    ) { }

    public logOut(): Observable<ServerResponse<EmptyResponse>> {
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + this._cookieService.get('refreshToken'));
        let params = new HttpParams();
        params = params.set('authorization', 'false');
        return this._httpClient.post<ServerResponse<EmptyResponse>>('logout', {}, { headers, params });
    }

    public fetchMainData(): void {
        const joined = [this.getMe(false), this.getAccountSettingsVariants()];
        forkJoin(joined)
            .subscribe((response) => {
                try {
                    const userRes: ServerResponse<User> = response[0];
                    const user = userRes.data;
                    this._checkUserAccountsState(user);
                } catch (error) {
                    this._router.navigate(['/auth/login'])
                }
            }, () => {
                this._router.navigate(['/auth/login']);
                this._cookieService.remove('accessToken');
                this._cookieService.remove('refreshToken');
            });
    }

    public getMe(isCheckAccountsState: boolean = true): Observable<ServerResponse<User>> {
        this.setShowDisabledView(true);
        return this._httpClient.get<ServerResponse<User>>('me')
            .pipe(
                map((data: ServerResponse<User>) => {
                    if (isCheckAccountsState) {
                        const user: User = data.data;
                        this._checkUserAccountsState(user);
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

    private _checkUserAccountsState(user: User): void {
        this._authService.setUserState(user);
        if (user) {
            if (user.instagramAccounts && user.instagramAccounts.length === 0) {
                this.setShowDisabledView(true);
                this._router.navigate(['']);
                this._accountConnection$.next({ isOpen: true });
            }
            else {
                this._checkIsHaveUnActiveAccount(user.instagramAccounts);
                this.setShowDisabledView(false);
            }
        }
        else {
            this._router.navigate(['']);
            this._accountConnection$.next({ isOpen: true });
            this.setShowDisabledView(true);
            return;
        }
        if (!this._authService.getAccount() || (this._authService.getAccount() && !this._authService.getAccount().id)) {
            if (user && user.instagramAccounts && user.instagramAccounts.length > 0) {
                const selectedAccount = user.instagramAccounts.find((element) => element.selected === true) || user.instagramAccounts[0];
                this._authService.setAccount(selectedAccount);
            }
        }
    }

    private _createImportantToastr(message: string): void {
        const toastrRef = this._toastrService.error(message, 'Важная информация !!!', {
            disableTimeOut: true,
            positionClass: 'toast-top-full-width',
            progressBar: true
        })
        toastrRef.onHidden.subscribe(() => {
            this._router.navigate(["/profile"], { queryParams: { tab: 'personal-settings' } });
        })
    }

    private _checkIsHaveUnActiveAccount(userAccounts: InstagramAccount[]): void {
        let verificationAccountNames: string = '';
        let changePasswordAccountNames: string = '';
        userAccounts.map((element: InstagramAccount) => {
            if (!element.verification) {
                verificationAccountNames += `${element.login}, `;
            }
            if (element.needPassword) {
                changePasswordAccountNames += `${element.login}, `;
            }
        })
        if (verificationAccountNames) {
            const message: string = `Для ${verificationAccountNames} аккаунтов необходима верификация для продолжения дальнейших действий:`;
            this._createImportantToastr(message);
        }
        if (changePasswordAccountNames) {
            const message: string = `Для ${changePasswordAccountNames} аккаунтов необходима изменение пароля для продолжения дальнейших действий:.`;
            this._createImportantToastr(message);
        }
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

    public resetMainProperties(): void {
        this._accountSettingsVariants = {} as AccountSettings;
        this._accountSettings$.next({} as AccountSettings);
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
        return this._isShowDisabledView;
    }

    public joinToTariff(data: JoinTariff): Observable<any> {
        return this._httpClient.post('tariff', data);
    }

    public accountSettingsVariants(): Observable<AccountContactSettings> {
        return this._accountSettings$.asObservable();
    }

    public getArticles(): Observable<ServerResponse<ArticleShort[]>> {
        return this._httpClient.get<ServerResponse<ArticleShort[]>>('article/wizard');
    }

    public openAccountConnectionModal(accontData?: any): void {
        this._accountConnection$.next({ isOpen: true, accountData: (accontData) ? accontData : null });
    }

    public closeAccountConnectionModal(): void {
        this._accountConnection$.next({ isOpen: false });
    }

    get accountSettingsVariantsSync(): AccountSettings {
        return this._accountSettingsVariants;
    }

    get accountConnectionState(): Observable<{ isOpen: boolean, accountData?: any }> {
        return this._accountConnection$.asObservable()
            .pipe(
                filter((event) => event != null)
            );
    }

    public changeInstagramAccountPassword(body: ChangeInstagramAccountRequest): Observable<ServerResponse<ChangeInstagramAccountRequest>> {
        return this._httpClient.post<ServerResponse<ChangeInstagramAccountRequest>>('instagram/change-password', body)
    }

    public resendCode(accountId: number): Observable<EmptyResponse> {
        return this._httpClient.post<EmptyResponse>('instagram/resend-code', { accountId: accountId });
    }

    public verificationCode(body): Observable<ServerResponse<VerificationCode>> {
        return this._httpClient.post<ServerResponse<VerificationCode>>('instagram/verification-code', body)
    }

}