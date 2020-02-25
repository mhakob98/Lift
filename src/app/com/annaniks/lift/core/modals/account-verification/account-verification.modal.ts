import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../../../pages/main/main.service';
import { VerificationCode } from '../../models/verification-code';
import { takeUntil, finalize } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
    selector: "account-verification",
    templateUrl: "account-verification.modal.html",
    styleUrls: ["account-verification.modal.scss"]
})

export class AccountVerificationModal implements OnInit {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public passwordErrorMessage: string;
    public verificationForm: FormGroup;
    public loading: boolean = false;
    constructor(private _fb: FormBuilder,
        private _mainService: MainService,
        private _dialogRef: MatDialogRef<AccountVerificationModal>,
        private _toastrService: ToastrService
    ) { }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.verificationForm = this._fb.group({
            accountName: [null, Validators.required],
            code: [null, Validators.required]
        })
    }

    private _verificationCode(): void {
        let verifcationCodeModel: VerificationCode = {
            accountId: this.verificationForm.value.accountName,
            code: this.verificationForm.value.code,
        }
        this.loading = true;
        this.passwordErrorMessage = undefined;
        this.verificationForm.disable();
        this._mainService.verificationCode(verifcationCodeModel)
            .pipe(
                takeUntil(this._unsubscribe$),
                finalize(() => {
                    this.loading = false
                    this.verificationForm.enable();
                })
            )
            .subscribe((data) => {
                this._toastrService.success('Изменения сохранены');
                this._dialogRef.close();
                console.log(data);

            },
                (err) => {
                    const error = err.error;
                    this.passwordErrorMessage = error.message || "Ошибка";
                    this._toastrService.error(this.passwordErrorMessage);
                })
    }

    public onClickSave(): void {
        this._verificationCode();
    }

    public checkIsValid(controlName): boolean {
        return this.verificationForm.get(controlName).hasError('required') && this.verificationForm.get(controlName).touched;
    }

}