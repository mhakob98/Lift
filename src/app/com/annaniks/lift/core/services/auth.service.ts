import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ServerResponse } from '../models/server-response';
import { AuthState } from '../models/auth';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _userInfo;
    private _userInfoState$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    private _isAuthorized: boolean = false;
    private _isAuthorizedState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private _httpClient: HttpClient) { }

    public setUserState(userInfo): void {
        this._userInfo = userInfo;
        this._userInfoState$.next(this._userInfo);
    }

    public getUserStateSync() {
        return this._userInfo;
    }

    public getUserState(): Observable<any> {
        return this._userInfoState$.asObservable();
    }

    public setAuthState(isAuthorized: boolean): void {
        this._isAuthorized = isAuthorized;
    }

    public getAuthStateSync(): boolean {
        return this._isAuthorized;
    }

    public getAuthState(): Observable<boolean> {
        return this._isAuthorizedState$.asObservable();
    }

    public checkAuthState(): Observable<boolean> {
        return this._httpClient.get<ServerResponse<AuthState>>('check-token')
            .pipe(
                map((response) => {
                    this.setAuthState(true);
                    return true;
                }),
                catchError((err) => {
                    this.setAuthState(false);
                    return throwError(false);
                })
            )
    }

}