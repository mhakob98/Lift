import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InformingService } from 'src/app/com/annaniks/lift/core/models/account-basic-settings';
import { ProfileService } from '../../profile.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingService } from 'src/app/com/annaniks/lift/core/services/loading-service';
import { AuthService } from 'src/app/com/annaniks/lift/core/services/auth.service';

@Component({
    selector: "app-notification-modal",
    templateUrl: "notification.modal.html",
    styleUrls: ["notification.modal.scss"]
})


export class NotificationModal implements OnInit, OnDestroy {

    public notificationForm: FormGroup;
    private _unsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private _dialogRef: MatDialogRef<NotificationModal>,
        private _fb: FormBuilder,
        private _profileService: ProfileService,
        private _loadingService: LoadingService,
        private _authService: AuthService
    ) { }

    ngOnInit() {
        this._formBuilder();
        this._bindCurrentState();
    }

    private _formBuilder(): void {
        this.notificationForm = this._fb.group({
            duration: [null],
            interval: [null],
            deltaPosts: [false],
            deltaFollowers: [false],
            deltaLikes: [false],
            deltaComments: [false],
            topPosts: [false],
            deltaStores: [false],
            deltaUnfollowings: [false],
            deltaSaves: [false],
            totalActions: [false],
            spendRatio: [false]
        })
    }

    public closeModal(): void {
        this._dialogRef.close();
    }

    public addInforming(): void {
        this._loadingService.showLoading();
        const notificationForm = this.notificationForm.value;
        const sendingData: InformingService = {
            instagramAccountId: Number(this._authService.getAccount().id),
            duration: Number(notificationForm.duration),
            interval: Number(notificationForm.interval),
            deltaPosts: notificationForm.deltaPosts,
            deltaFollowers: notificationForm.deltaFollowers,
            deltaLikes: notificationForm.deltaLikes,
            deltaComments: notificationForm.deltaComments,
            topPosts: notificationForm.topPosts,
            deltaStores: notificationForm.deltaStores,
            deltaUnfollowings: notificationForm.deltaUnfollowings,
            deltaSaves: notificationForm.deltaSaves,
            totalActions: notificationForm.totalActions,
            spendRatio: notificationForm.spendRatio
        }
        this._profileService.addInforming(sendingData).pipe(
            finalize(() => this._loadingService.hideLoading()),
            takeUntil(this._unsubscribe)
        ).subscribe(() => {
            this.closeModal();
        })
    }

    private _bindCurrentState(): void {
        this._loadingService.showLoading();
        this._profileService.getInforming(+this._authService.getAccount().id).pipe(
            finalize(() => this._loadingService.hideLoading()),
            takeUntil(this._unsubscribe)
        ).subscribe((response) => {
            this.notificationForm.patchValue(response.data)
        })
    }
    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}