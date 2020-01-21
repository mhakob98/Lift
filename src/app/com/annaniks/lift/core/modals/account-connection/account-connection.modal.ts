import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MainService } from '../../../pages/main/main.service';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize, takeUntil, take } from 'rxjs/operators';
import { TwoFactorLoginData } from '../../models/account';
import { Subject } from 'rxjs';
import { timingSafeEqual } from 'crypto';

@Component({
    selector: "account-connection-modal",
    templateUrl: "account-connection.modal.html",
    styleUrls: ["account-connection.modal.scss"]
})

export class AccountConnectionModal implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    private _isTwoFactorAuth: boolean = false;
    private _twoFactorIdentifier: string;
    public tab: number = 1;
    public loginForm: FormGroup;
    public tariffForm: FormGroup;
    public actionForm: FormGroup;
    public promotionForm: FormGroup;
    public showCode: boolean = false;
    public errorMessage: string;
    public loading: boolean = false;

    constructor(
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _dialogRef: MatDialogRef<AccountConnectionModal>
    ) { }

    ngOnInit() {
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
                this._dialogRef.close();
            },
                (err) => {
                    const error = err.error;
                    const response = error.data;
                    if (response.invalid_credentials) {
                        this.errorMessage = response.message;
                    }
                    if (response.two_factor_required) {
                        this.showCode = true;
                        this.loginForm.addControl('code', new FormControl(null, Validators.required));
                        this._twoFactorIdentifier = response.two_factor_info.two_factor_identifier;
                        this._isTwoFactorAuth = true;
                    }
                })
    }

    private _twoFactorLogin(): void {
        const sendingData: TwoFactorLoginData = {
            code: this.loginForm.get('code').value,
            password: this.loginForm.get('password').value,
            username: this.loginForm.get('email').value,
            two_factor_identifier: this._twoFactorIdentifier
        }
        this._mainService.twoFactorLogin(sendingData)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {
                this._dialogRef.close();
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
        }
        else {
            this._connectAccount();
        }
    }

    public changeTab(tab): void {
        this.tab = tab;
    }

    public postAccountConnectionValues(): void {
        this._mainService.postAccountConnectionValues({
            tarriff: this.tariffForm.value.tariff,
            action: this.actionForm.value.action,
            promotion: this.promotionForm.value,
        })
            .subscribe((data) => {
                console.log(data);
                this._dialogRef.close();
            })

    }




    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }



}