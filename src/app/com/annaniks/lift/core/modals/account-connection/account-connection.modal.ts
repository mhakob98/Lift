import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MainService } from '../../../pages/main/main.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, takeUntil } from 'rxjs/operators';
import { TwoFactorLoginData, ChallengeLoginData } from '../../models/account';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserType } from '../../models/account-settings';
import { Router } from '@angular/router';


@Component({
    selector: "account-connection-modal",
    templateUrl: "account-connection.modal.html",
    styleUrls: ["account-connection.modal.scss"]
})

export class AccountConnectionModal implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    private _isAccountConnected: boolean = false;
    private _isTwoFactorAuth: boolean = false;
    private _isChallangeAuth: boolean = false;
    private _twoFactorIdentifier: string;
    public isFirstAccount: boolean = false;
    public tab: number = 1;
    public loginForm: FormGroup;
    public tariffForm: FormGroup;
    public actionForm: FormGroup;
    public promotionForm: FormGroup;
    public showCode: boolean = false;
    public errorMessage: string;
    public loading: boolean = false;
    public userTypes: UserType[] = [];

    constructor(
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _router: Router,
        private _dialogRef: MatDialogRef<AccountConnectionModal>,
        @Inject(MAT_DIALOG_DATA) private _dialogData: { isFirstAccount?: boolean }
    ) { }

    ngOnInit() {
        this.userTypes = this._mainService.accountSettingsVariantsSync.userTypes;
        this.isFirstAccount = (this._dialogData && this._dialogData.isFirstAccount !== undefined) ? this._dialogData.isFirstAccount : true;
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.loginForm = this._fb.group({
            email: ["", Validators.required],
            password: ["", Validators.required],
        })
        this.tariffForm = this._fb.group({
            tariff: [null, Validators.required]
        })

        this.promotionForm = this._fb.group({
            autosubscription: [false],
            autoreviewstories: [false],
            bonus: [false]
        })
        this.actionForm = this._fb.group({
            action: [null, Validators.required]
        })
    }

    private _connectAccount(): void {
        this.loading = true;
        this.errorMessage = undefined;
        this._isAccountConnected = false;
        this._mainService.accountConnect({
            username: this.loginForm.value.email,
            password: this.loginForm.value.password,
        })
            .pipe(
                finalize(() => this.loading = false),
                takeUntil(this._unsubscribe$)
            )
            .subscribe((data) => {
                this.loginForm.get('email').disable();
                this.loginForm.get('password').disable();
                if (this.isFirstAccount) {
                    this.tab = 2;
                }
                else {
                    this.tab = 3;
                }

            },
                (err) => {
                    const error = err.error;
                    const response = error.data;
                    if (response.invalid_credentials) {
                        this.errorMessage = response.message;
                    }
                    if (response.two_factor_required || (response.error_type && response.error_type === 'checkpoint_challenge_required')) {
                        this.showCode = true;
                        this.loginForm.addControl('code', new FormControl(null, Validators.required));
                        if (response.two_factor_required) {
                            this._twoFactorIdentifier = response.two_factor_info.two_factor_identifier;
                            this._isTwoFactorAuth = true;
                            this._isChallangeAuth = false;
                        }
                        else if (response.error_type === 'checkpoint_challenge_required') {
                            this._isChallangeAuth = true;
                            this._isTwoFactorAuth = false;
                        }
                    }
                })
    }

    private _twoFactorLogin(): void {
        this.loading = true;
        const sendingData: TwoFactorLoginData = {
            code: this.loginForm.get('code').value,
            password: this.loginForm.get('password').value,
            username: this.loginForm.get('email').value,
            two_factor_identifier: this._twoFactorIdentifier
        }
        this._mainService.twoFactorLogin(sendingData)
            .pipe(
                takeUntil(this._unsubscribe$),
                finalize(() => this.loading = false)
            )
            .subscribe((data) => {
                if (this.isFirstAccount) {
                    this.tab = 2;
                }
                else {
                    this.tab = 3;
                }
            })
    }

    private _challengeLogin(): void {
        this.loading = true;
        const sendingData: ChallengeLoginData = {
            code: this.loginForm.get('code').value,
            username: this.loginForm.get('email').value,
        }
        this._mainService.challengeLogin(sendingData)
            .pipe(
                takeUntil(this._unsubscribe$),
                finalize(() => this.loading = false)
            )
            .subscribe((data) => {
                if (this.isFirstAccount) {
                    this.tab = 2;
                }
                else {
                    this.tab = 3;
                }
            })
    }

    private _joinToTariff(id) {
        this._mainService.joinToTariff({
            tariffId: id,
        })
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(
                (data) => {
                    this.tab = 3;
                })
    }

    public changedTab(tab): void {
        this.tab = tab;
    }

    public checkIsValid(controleName): boolean {
        return this.loginForm.get(controleName) && this.loginForm.get(controleName).hasError('required') && this.loginForm.get(controleName).touched;
    }

    public addAccount(): void {
        if (this._isTwoFactorAuth) {
            this._twoFactorLogin();
            return;
        }
        else if (this._isChallangeAuth) {
            this._challengeLogin();
        }
        else {
            this._connectAccount();
            return;
        }
    }

    public changeTab(tab): void {
        this.tab = tab;
    }

    public onClickSave(): void {
        const action = this.actionForm.get('action').value;
        if (action == 'auto-subscription') {
            this._router.navigate(['/promotion/autosubscribe']);
        }
        if (action == 'view-stories') {
            this._router.navigate(['/promotion/auto-watch-story']);
        }
        this._dialogRef.close();
    }

    public onClickClose(): void {
        if (!this.loading) {
            this._dialogRef.close({ isAccountConnected: false });
        }
    }

    public onClickJoinToTariff(): void {
        const tarriffId: number = this.tariffForm.get('tariff').value
        this._joinToTariff(tarriffId);
    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}