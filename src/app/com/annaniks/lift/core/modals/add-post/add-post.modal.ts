import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: "add-post-modal",
    templateUrl: "add-post.modal.html",
    styleUrls: ["add-post.modal.scss"]
})

export class AddPostModal implements OnInit {

    constructor(private _dialogRef: MatDialogRef<AddPostModal>) { }

    ngOnInit() { }


    public closeModal(): void {
        this._dialogRef.close();
    }
}