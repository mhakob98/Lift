import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AudienceFilterComponent } from '../../../promotion/auto-subscribe-or-watch-story';

@Component({
    selector: "app-direct-schedule",
    templateUrl: "direct-schedule.component.html",
    styleUrls: ["direct-schedule.component.scss"]
})

export class DirectScheduleComponent implements OnInit {
    public signatureGroup: FormGroup;
    public tab: number = 1;

    constructor(
        private _fb: FormBuilder,
        private _matDialog: MatDialog
    ) { }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.signatureGroup = this._fb.group({
            delayedSending: [null],
            delayedSendingTime: [null],
            dontSendIfCorrespondence: [null],
            sendAfterSubscription: [null],
            applyForSubscribers: [null],
            mailingText: [null],
            mailingTextType: [null]
        })
        this.signatureGroup.get('applyForSubscribers').valueChanges.subscribe((value) => {
            if (value) {
                this._openFiltersModal();
            }
        })
    }

    private _openFiltersModal(): void {
        this._matDialog.open(AudienceFilterComponent, {
            maxWidth: '80vw',
            maxHeight: '80vw'
        });
    }

    public onChangeTab(tab): void {
        this.tab = tab;
    }
}