import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotificationModal } from '../notification-modal/notification.modal';

@Component({
    selector: "basic-settings",
    templateUrl: "basic-settings.component.html",
    styleUrls: ["basic-settings.component.scss"]
})

export class BasicSettingsComponent implements OnInit {

    public loginForm: FormGroup;
    public passwordForm: FormGroup;
    public notificationForm: FormGroup;

    constructor(private _fb: FormBuilder, private _dialog: MatDialog) { }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.loginForm = this._fb.group({
            login: ["", Validators.required],
            email: ["", Validators.required],
            time: [""]
        })
        this.passwordForm = this._fb.group({
            password: ["", Validators.required],
            newPassword: ["", Validators.required],
            repeatPassword: ["", Validators.required]
        })
        this.notificationForm = this._fb.group({
            email: ["", Validators.required]
        })
    }

    public openNotificationModal(): void {
        const dialogRef = this._dialog.open(NotificationModal, {
    
          width:"1200px"
        })
    }

    public checkIsValid(formGroup, controlName): boolean {
        return formGroup.get(controlName).hasError('required') && formGroup.get(controlName).touched;
    }
}