import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from '../../../core/services/navbar.service';
import { MainService } from '../main.service';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

    public tab: number = 1;
    constructor(
        private _navbarService: NavbarService,
        private _mainService: MainService
    ) { }

    ngOnInit() {
        this._navbarService.setNavbarItems([]);
    }

    public changedTab(tab): void {
        this.tab = tab;

    }

    public deleteSelectedAccount(): void {
        this._mainService.deleteInstaAccount().subscribe((data) => {
            console.log(data);

        })
    }
    ngOnDestroy() { }
}