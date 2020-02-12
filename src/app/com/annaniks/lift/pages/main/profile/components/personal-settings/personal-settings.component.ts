import { Component, OnInit, OnDestroy, Input, AfterViewInit, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../profile.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, finalize, switchMap, map } from 'rxjs/operators';
import { ChangeMe } from 'src/app/com/annaniks/lift/core/models/change-me';
import { User, InstagramAccount } from 'src/app/com/annaniks/lift/core/models/user';
import { MainService } from '../../../main.service';
import { LoadingService } from 'src/app/com/annaniks/lift/core/services/loading-service';
import { AuthService } from 'src/app/com/annaniks/lift/core/services/auth.service';
import { AccountConnectionModal } from 'src/app/com/annaniks/lift/core/modals';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ServerResponse } from 'src/app/com/annaniks/lift/core/models/server-response';
import { AccountSettings } from 'src/app/com/annaniks/lift/core/models/account-settings';

@Component({
    selector: "personal-settings",
    templateUrl: "personal-settings.component.html",
    styleUrls: ["personal-settings.component.scss"]
})

export class PersonalSettings implements OnInit, OnDestroy {
    @Input('user')
    set _userData(event) {
        this._formBuilder();
        if (event) {
            this._bindPersonalSettings(event);
        }
    }

    @Output('nextTab')
    private _nextTab = new EventEmitter<number>();

    private _unsubscribe$: Subject<void> = new Subject<void>();
    public dataForm: FormGroup;
    public contactForm: FormGroup;
    public loading: boolean = false;
    public userAccounts: InstagramAccount[] = [];

    constructor(
        private _fb: FormBuilder,
        private _profileService: ProfileService,
        private _mainService: MainService,
        private _authService: AuthService,
        private _loadingService: LoadingService,
        private _dialog: MatDialog,
        private _router: Router
    ) { }

    ngOnInit() {
        this._getUser();
    }

    public deleteInstagramAccount(id: number): void {
        this._loadingService.showLoading();
        this._mainService.deleteInstaAccount(id).pipe(
            finalize(() => this._loadingService.hideLoading()),
            takeUntil(this._unsubscribe$)
        ).subscribe((data) => {
            this.userAccounts.map((account: InstagramAccount, index: number) => {
                if (account.id = id) {
                    this.userAccounts.splice(index, 1)
                }
            })
            if (this.userAccounts.length == 0) {
                this._refreshUser();
            }
        })
    }

    public openAccountConnectionModal(): void {
        const dialofRef = this._dialog.open(AccountConnectionModal, {
            width: "700px",
            disableClose: true,
            data: {
                isFirstAccount: false
            }
        })
        dialofRef.afterClosed()
            .subscribe((data: { isAccountConnected: boolean }) => {
                if (data && !data.isAccountConnected && this.userAccounts.length == 0) {
                    this._router.navigate(['/auth/login'])
                    this._loadingService.hideLoading()
                } else {
                    this._refreshUser();
                }
            })
    }

    private _getAccountSettingsVariants(): Observable<ServerResponse<AccountSettings>> {
        return this._mainService.getAccountSettingsVariants()
            .pipe(takeUntil(this._unsubscribe$))
    }

    private _formBuilder(): void {
        this.dataForm = this._fb.group({
            name: ["", Validators.required],
            day: [null, Validators.required],
            month: ["", Validators.required],
            year: ["", Validators.required],
            male: [true, Validators.required]
        })
        this.contactForm = this._fb.group({
            phoneNumber: ["", Validators.required],
            currentCity: ["", Validators.required]
        })

    }

    public checkIsValid(formGroup, cotrolName): boolean {
        return formGroup.get(cotrolName).hasError('required') && formGroup.get(cotrolName).touched;
    }

    private _getUser(): void {
        this._authService.getUserState()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {
                if (!!data) {
                    this.userAccounts = data.instagramAccounts;
                }
            })
    }

    private _refreshUser(): void {
        this._loadingService.showLoading()
        let user = {} as User;
        this._mainService.getMe()
            .pipe(
                finalize(() => this._loadingService.hideLoading()),
                takeUntil(this._unsubscribe$),
                switchMap((data) => {
                    user = data.data;
                    return this._getAccountSettingsVariants()
                }),
                map((data) => {
                    if (user.instagramAccounts) {
                        if (user.instagramAccounts.length === 0) {
                            this._router.navigate(['']);
                            this.openAccountConnectionModal();
                        }
                    }
                    else {
                        this._router.navigate(['']);
                        this.openAccountConnectionModal();
                    }
                })
            ).subscribe()
    }

    public changeMe(): void {
        this.loading = true
        let dataForm = this.dataForm.value
        let contactForm = this.contactForm.value
        let sendingData: ChangeMe = {
            name: dataForm.name,
            male: dataForm.male,
            dbDay: +dataForm.day,
            dbMount: +dataForm.month,
            dbYear: +dataForm.year,
            city: contactForm.currentCity,
            phone: contactForm.phoneNumber,

        }
        this._profileService.changeMe(sendingData)
            .pipe(
                takeUntil(this._unsubscribe$),
                finalize(() => this.loading = false)
            ).
            subscribe(() => this._nextTab.emit(3))
    }

    private _bindPersonalSettings(settings): void {
        this.contactForm.patchValue({
            phoneNumber: settings.city,
            currentCity: settings.phone
        })
        this.dataForm.patchValue({
            male: settings.male,
            name: settings.name,
            day: settings.dbDay ? settings.dbDay.toString() : null,
            month: settings.dbMount ? settings.dbMount.toString() : null,
            year: settings.dbYear ? settings.dbYear.toString() : null,
        })
        console.log(this.dataForm);

    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.unsubscribe();
    }
}