import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from '../../../core/services/navbar.service';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

    constructor(private _navbarService: NavbarService) { }

    ngOnInit() {
        this._navbarService.setNavbarItems([]);
    }

    ngOnDestroy() { }
}