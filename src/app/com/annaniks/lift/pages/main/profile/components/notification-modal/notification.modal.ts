import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: "app-notification-modal",
    templateUrl: "notification.modal.html",
    styleUrls: ["notification.modal.scss"]
})


export class NotificationModal implements OnInit {

    public notificationForm: FormGroup;

    constructor(private _dialogRef: MatDialogRef<NotificationModal>, private _fb: FormBuilder) { }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.notificationForm = this._fb.group({
            time: [],
            notifyRange: []
        })
    }

    public closeModal(): void {
        this._dialogRef.close();
    }



}