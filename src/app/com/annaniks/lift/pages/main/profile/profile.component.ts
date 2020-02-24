import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from '../../../core/services/navbar.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from '../../../core/models/user';
import { AuthService } from '../../../core/services/auth.service';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public userData: User
    public tab: number = 1;
    constructor(
        private _navbarService: NavbarService,
        private _authService: AuthService
    ) { }

    ngOnInit() {
        this._navbarService.setNavbarItems([]);
        this._fetchProfileData()
    }



    private _fetchProfileData(): void {
        this._authService.getUserState().pipe(
            takeUntil(this._unsubscribe$)
        ).subscribe(data => {
            this.userData = data
        })

    }
    
    public changedTab(tab): void {
        this.tab = tab;
    }
 

    ngOnDestroy() {
        this._unsubscribe$.next()
        this._unsubscribe$.complete()
    }
}