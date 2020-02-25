import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../../../pages/main/main.service';
import { VerificationCode } from '../../models/verification-code';
import { takeUntil, finalize } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { InstagramAccount } from '../../models/user';

@Component({
    selector: "account-verification",
    templateUrl: "account-verification.modal.html",
    styleUrls: ["account-verification.modal.scss"]
})

export class AccountVerificationModal implements OnInit {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    private _account: InstagramAccount;
    public passwordErrorMessage: string;
    public verificationForm: FormGroup;
    public loading: boolean = false;
    constructor(
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _dialogRef: MatDialogRef<AccountVerificationModal>,
        private _toastrService: ToastrService,
        @Inject(MAT_DIALOG_DATA) private _data: { account: InstagramAccount }
    ) {
        this._account = this._data.account;
    }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.verificationForm = this._fb.group({
            accountName: [{ value: this._account.login, disabled: true }, Validators.required],
            code: [null, Validators.required]
        })
    }

    private _verificationCode(): void {
        let verifcationCodeData: VerificationCode = {
            accountId: String(this._account.id),
            code: this.verificationForm.value.code,
        }
        this.loading = true;
        this.passwordErrorMessage = undefined;
        this.verificationForm.disable();
        this._mainService.verificationCode(verifcationCodeData)
            .pipe(
                takeUntil(this._unsubscribe$),
                finalize(() => {
                    this.loading = false;
                    this.verificationForm.enable();
                    this.verificationForm.get('accountName').disable();
                })
            )
            .subscribe((data) => {
                this._toastrService.success('Изменения сохранены');
                this._dialogRef.close({
                    isVerified: true
                });
            },
                (err) => {
                    const error = err.error;
                    this.passwordErrorMessage = error.message || "Ошибка";
                    this._toastrService.error(this.passwordErrorMessage);
                })
    }

    public onClickSendCodeAgain(): void {
        this._mainService.resendCode(this._account.id).subscribe(
            () => {
                this._toastrService.success('Код успешно отправлено !')
            },
            (err) => {
                const error = err.error;
                const message: string = error.message || "Ошибка";
                this._toastrService.error(message);
            }
        )
    }

    public onClickSave(): void {
        this._verificationCode();
    }

    public checkIsValid(controlName): boolean {
        return this.verificationForm.get(controlName).hasError('required') && this.verificationForm.get(controlName).touched;
    }

}