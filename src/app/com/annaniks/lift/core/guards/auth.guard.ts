import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanLoad {

    constructor(private _authService: AuthService) { }

    canLoad(): Observable<boolean> | Promise<boolean> | boolean {
        return this._authService.checkAuthState();
    }
}