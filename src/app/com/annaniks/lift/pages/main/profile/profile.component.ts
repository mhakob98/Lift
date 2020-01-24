import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from '../../../core/services/navbar.service';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

    public tab: number = 1;
    constructor(private _navbarService: NavbarService) { }

    ngOnInit() {
        this._navbarService.setNavbarItems([]);
    }

    public changedTab(tab): void {
        this.tab = tab;
        
    }
    ngOnDestroy() { }
}