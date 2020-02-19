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
    ) { }

    ngOnInit() {
        this._getUser();
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
        this._loadingService.showLoading();
        this._mainService.getMe().subscribe();
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
    }

    public deleteInstagramAccount(id: number): void {
        this._loadingService.showLoading();
        this._mainService.deleteInstaAccount(id).pipe(
            finalize(() => this._loadingService.hideLoading()),
            takeUntil(this._unsubscribe$)
        ).subscribe((data) => {
            const activeAccount = this._authService.getAccount();
            if (activeAccount && activeAccount.id && (id === activeAccount.id)) {
                this._authService.setAccount({} as InstagramAccount);
            }
            this._refreshUser();
        })
    }

    public checkIsValid(formGroup, cotrolName): boolean {
        return formGroup.get(cotrolName).hasError('required') && formGroup.get(cotrolName).touched;
    }


    public onClickAddAccount(): void {
        this._mainService.openAccountConnectionModal({ isFirstAccount: false });
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

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.unsubscribe();
    }
}