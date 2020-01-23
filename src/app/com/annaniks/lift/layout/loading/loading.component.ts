import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../core/services/loading-service';
// import { Loading } from '../../models/models';

@Component({
    selector: 'app-loading',
    templateUrl: 'loading.component.html',
    styleUrls: ['loading.component.scss'],

})
export class LoadingComponent implements OnInit, OnDestroy {
    private _show = false;
    private _subscription: Subscription;

    constructor(
        private _loadingService: LoadingService
    ) { }

    ngOnInit() {
        this._subscription = this._loadingService.getLoaderState()
            .subscribe((state: any) => {
                this._show = state.show;
            });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    get show(): boolean {
        return this._show;
    }
}