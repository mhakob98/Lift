import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: "app-direct-schedule",
    templateUrl: "direct-schedule.component.html",
    styleUrls: ["direct-schedule.component.scss"]
})

export class DirectScheduleComponent implements OnInit {
    public signatureGroup: FormGroup;
    public tab: number = 1;

    constructor(private _fb: FormBuilder) { }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.signatureGroup = this._fb.group({
            signatureValue: [null],
            select: [null]
        })
    }

    public onChangeTab(tab): void {
        this.tab = tab;
    }
}