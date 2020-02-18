import { Component, OnInit, OnDestroy, Input, AfterViewInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotificationModal } from '../notification-modal/notification.modal';
import { ChangePasswordData } from '../../../../../core/models/account-basic-settings';
import { ProfileService } from '../../profile.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatchPassword } from '../../../../../core/utilities/match-password';
import { ToastrService } from 'ngx-toastr';
import { ChangeMe } from 'src/app/com/annaniks/lift/core/models/change-me';
import { User } from 'src/app/com/annaniks/lift/core/models/user';

@Component({
    selector: "basic-settings",
    templateUrl: "basic-settings.component.html",
    styleUrls: ["basic-settings.component.scss"]
})

export class BasicSettingsComponent implements OnInit, OnDestroy {
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
    private _matchPassword: MatchPassword = new MatchPassword();
    public loginForm: FormGroup;
    public passwordForm: FormGroup;
    public notificationForm: FormGroup;
    public changePasswordLoading: boolean = false;
    public passwordErrorMessage: string;
    public loading: boolean = false;

    constructor(
        private _fb: FormBuilder,
        private _dialog: MatDialog,
        private _profileService: ProfileService,
        private _toastrService: ToastrService
    ) { }

    ngOnInit() {
    }

    private _formBuilder(): void {
        this.loginForm = this._fb.group({
            // login: ["", Validators.required],
            email: ["", Validators.required],
            time: ["+4:00"]
        })
        this.passwordForm = this._fb.group({
            password: ["", Validators.required],
            newPassword: ["", Validators.required],
            repeatPassword: ["", Validators.required]
        }, { validator: this._matchPassword.check('newPassword', 'repeatPassword') })
        this.notificationForm = this._fb.group({
            notification: false,
            email: ["", Validators.required]
        })
    }

    private _changePassword(): void {
        this.passwordErrorMessage = undefined;
        this.changePasswordLoading = true;
        const sendingData: ChangePasswordData = {
            password: this.passwordForm.get('password').value,
            newPassword: this.passwordForm.get('repeatPassword').value
        }
        this._profileService.changePassword(sendingData)
            .pipe(
                takeUntil(this._unsubscribe$),
                finalize(() => this.changePasswordLoading = false)
            )
            .subscribe(
                (data) => {
                    this._toastrService.success('Изменения сохранены')
                },
                (err) => {
                    const error = err.error;
                    this.passwordErrorMessage = error.message || "Ошибка";
                    this._toastrService.error(this.passwordErrorMessage);
                })
    }



    public openNotificationModal(): void {
        this._dialog.open(NotificationModal, {
            width: "1200px",
            maxWidth: "100%",
            panelClass: ['panelClass']
        })
    }

    public onClickChangePassword(): void {
        if (this.passwordForm.valid) {
            this._changePassword();
        }
    }

    public checkIsValid(formGroup, controlName): boolean {
        return formGroup.get(controlName).hasError('required') && formGroup.get(controlName).touched;
    }

    public changeMe(type: string, navigate: boolean = false): void {
        this.loading = true
        let loginForm = this.loginForm.value
        let notificationForm = this.notificationForm.value
        let sendingData: ChangeMe = {}
        switch (type) {
            case 'loginForm':
                sendingData = {
                    email: loginForm.email,
                    timeZone: loginForm.time,
                }
                break;
            case 'notificationForm':
                sendingData = {
                    notification: notificationForm.notification,
                    notoficationMail: notificationForm.email
                }
                break;
            default:
                break;
        }
        this._profileService.changeMe(sendingData)
            .pipe(
                takeUntil(this._unsubscribe$),
                finalize(() => this.loading = false)
            ).
            subscribe(() => navigate ? this._nextTab.emit(2) : null)
    }

    private _bindPersonalSettings(settings): void {
        this.loginForm.patchValue({
            email: settings.email,
            time: settings.timeZone
        })
        this.notificationForm.patchValue({
            notification: settings.notification,
            email: settings.email
        })
    }


    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.unsubscribe();
    }
}