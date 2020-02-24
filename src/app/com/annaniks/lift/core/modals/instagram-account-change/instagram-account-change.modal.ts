import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatchPassword } from '../../utilities/match-password';
import { MainService } from '../../../pages/main/main.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { InstagramAccount } from '../../models/user';
import { ChangeInstagramAccountRequest } from '../../models/change-password-recuest';
import { MatDialogRef } from '@angular/material';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: "instagram-account-change",
    templateUrl: "instagram-account-change.modal.html",
    styleUrls: ["instagram-account-change.modal.scss"]
})

export class InstagramAccountChangeModal implements OnInit {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    private _userAccount: InstagramAccount;
    public passwordForm: FormGroup;
    public passwordErrorMessage: string;
    private loading: boolean=false;
    private _matchPassword: MatchPassword = new MatchPassword();
    constructor(
        private _fb: FormBuilder, private _mainService: MainService,
        private _toastrService: ToastrService, private _authService: AuthService,
        private _dialogRef: MatDialogRef<InstagramAccountChangeModal>) { }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.passwordForm = this._fb.group({
            accountName: [{value:null,disabled:true}],
            oldPassword: [null, Validators.required],
            newPassword: [null, Validators.required],
            repeatPassword: [null, Validators.required]
        },
            { validator: this._matchPassword.check('newPassword', 'repeatPassword') })
        this._userAccount = this._authService.getAccount();
        this.passwordForm.get('accountName').patchValue(this._userAccount.login);

    }

    private _changeInstagramAccountPassword(): void {
        this.passwordErrorMessage = undefined;
        this.loading=true;
        this.passwordForm.disable();
        const instagramAccount: ChangeInstagramAccountRequest = {
            username: this.passwordForm.value.accountName,
            password: this.passwordForm.value.oldPassword,
            newPassword: this.passwordForm.value.newPassword,
        }
        this._mainService.changeInstagramAccountPassword(instagramAccount)
        .pipe(
            takeUntil(this._unsubscribe$),
            finalize(() => {
                this.loading = false
                this.passwordForm.enable();
                this.passwordForm.get('accountName').disable();
            })
        )
            .subscribe((data) => {
                this._toastrService.success('Изменения сохранены');
                this._dialogRef.close();
            },
                (err) => {
                    const error = err.error;
                    this.passwordErrorMessage = error.message || "Ошибка";
                    this._toastrService.error(this.passwordErrorMessage);
                })

    }

    public onClickSave(): void {
        this._changeInstagramAccountPassword();
    }

    public checkIsValid(formGroup, controlName: string): boolean {
        return formGroup.get(controlName).hasError('required') && this.passwordForm.get(controlName).touched;
    }


}