import { Injectable } from '@angular/core';
import { NavbarItem } from '../models/navbar';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavbarService {
    private _navbarItems: NavbarItem[] = [];
    private _navbarItemsChangeEvent$: BehaviorSubject<NavbarItem[]> = new BehaviorSubject<NavbarItem[]>([]);

    constructor() { }

    public getNavbarItemsSync(): NavbarItem[] {
        return this._navbarItems;
    }

    public setNavbarItems(navbarItems: NavbarItem[]): void {
        this._navbarItems = navbarItems;
        this._navbarItemsChangeEvent$.next(navbarItems);
    }

    public get navbarItemsChangeEvent(): Observable<NavbarItem[]> {
        return this._navbarItemsChangeEvent$.asObservable();
    }
}