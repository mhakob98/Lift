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
import { AcocountConnectionModal } from '../../core/modals';

@Injectable()
export class MainService {
    private _isShowDisabledView: boolean = true;

    constructor(
        private _httpClient: HttpClient,
        private _cookieService: CookieService,
        private _authService: AuthService,
        private _matDialog:MatDialog
    ) { }

    private _openAccountConnectModal():void{
        this._matDialog.open(AcocountConnectionModal,{
            maxWidth:'80vw',
            maxHeight:'80vh',
            width:'700px',
            disableClose:true
        })
    }

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
                    const user = data.data;
                    if (user.istagramAccounts.length == 0) {
                        this.setShowDisabledView(true);
                        this._openAccountConnectModal();
                    }
                    else{
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
        document.body.style.overflow = 'scroll';
    }

    public getShowDisabledView(): boolean {
        return this._isShowDisabledView;
    }
    
}