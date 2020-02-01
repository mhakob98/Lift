import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, finalize, switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie';
import { TokenResponse } from '../models/auth';
import { ServerResponse } from '../models/server-response';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private _updateTokenEvent$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    private _updateTokenState: Observable<boolean>;
    private _loading: boolean = false;

    constructor(
        private _httpClient: HttpClient,
        private _cookieService: CookieService,
        private _router: Router
    ) {
        this._updateTokenState = this._updateTokenEvent$.asObservable();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                catchError((err) => {
                    const status: number = err.status;
                    const error = err.error;
                    if (status === 401 || error.status === 401) {
                        if (!this._loading) {
                            this._updateToken();
                        }
                        return this._updateTokenState
                            .pipe(
                                switchMap((isUpdated) => {
                                    if (!!isUpdated) {
                                        return next.handle(this._setNewHeaders(req));
                                    }
                                    else if (isUpdated === false) {
                                        // this._router.navigate(['/auth/login']);
                                        return throwError(false);
                                    }
                                    return throwError(err);

                                })
                            )
                    }
                    return throwError(err);
                })
            );
    }

    private _updateToken(): void {
        let params = new HttpParams();
        let headers = new HttpHeaders();
        const refreshToken = this._cookieService.get('refreshToken');
        params = params.set('authorization', 'false');
        this._loading = true;
        if (refreshToken) {
            headers = headers.append('Authorization', 'Bearer ' + this._cookieService.get('refreshToken'));
            this._httpClient.post<ServerResponse<TokenResponse>>('refresh', {}, { params, headers })
                .pipe(
                    finalize(() => this._loading = false),
                    map((data) => data.data),
                    map((data: TokenResponse) => {
                        this._updateCookies(data);
                        this._updateTokenEvent$.next(true);
                    }),
                    catchError((err) => {
                        // this._router.navigate(['/auth/login']);
                        this._updateTokenEvent$.next(false);
                        return throwError(false);
                    })
                )
                .subscribe();
        }
        else {
            this._loading = false;
            // this._router.navigate(['/auth/login']);
        }
    }

    private _updateCookies(data: TokenResponse): void {
        this._cookieService.put('accessToken', data.accessToken);
    }

    private _setNewHeaders(req: HttpRequest<any>): HttpRequest<any> {
        let httpHeaders: HttpHeaders = req.headers;
        httpHeaders = httpHeaders.delete('Authorization');
        httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + this._cookieService.get('accessToken') || '')
        const clonedReq = req.clone({
            headers: httpHeaders
        })
        return clonedReq;
    }
}
