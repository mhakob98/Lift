import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from '../../../core/services/navbar.service';
import { MainService } from '../main.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from '../../../core/models/user';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public userData: User;
    public tab: number = 1;
    constructor(
        private _navbarService: NavbarService,
        private _authService: AuthService,
        private _activatedRoute: ActivatedRoute
    ) {
        this._checkRouteParams();
    }

    ngOnInit() {
        this._navbarService.setNavbarItems([]);
        this._fetchProfileData();
    }

    private _checkRouteParams(): void {
        this._activatedRoute.queryParams
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((params) => {
                if (params && params.tab) {
                    switch (params.tab) {
                        case 'basic-settings': {
                            this.tab = 1;
                            break;
                        }
                        case 'personal-settings': {
                            this.tab = 2;
                            break;
                        }
                        case 'additional-settings': {
                            this.tab = 3;
                            break;
                        }
                        default: {
                            this.tab = 1;
                            break;
                        }
                    }
                }
                else {
                    this.tab = 1;
                }
            })
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