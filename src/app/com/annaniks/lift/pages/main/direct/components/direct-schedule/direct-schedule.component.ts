import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AudienceFilterComponent } from '../../../promotion/auto-subscribe-or-watch-story';
import { DirectService } from '../../direct.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NewMailing } from 'src/app/com/annaniks/lift/core/models/direct';
import { AuthService } from '../../../../../core/services/auth.service';
import { AutoSubscribeOrWatchStoryService } from 'src/app/com/annaniks/lift/shared/services/auto-subscribe-watch-story.service';
import { LoadingService } from 'src/app/com/annaniks/lift/core/services/loading-service';

@Component({
    selector: "app-direct-schedule",
    templateUrl: "direct-schedule.component.html",
    styleUrls: ["direct-schedule.component.scss"]
})

export class DirectScheduleComponent implements OnInit, OnDestroy {
    @Input() files: string[]
    public signatureGroup: FormGroup;
    public tab: number = 1;
    private _unsubscribe$: Subject<void> = new Subject<void>();

    constructor(
        private _fb: FormBuilder,
        private _matDialog: MatDialog,
        private _directService: DirectService,
        private _authService: AuthService,
        private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService,
        private _loadingService: LoadingService
    ) { }

    ngOnInit() {
        this._formBuilder();
        this._subscribeToSend();
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

    private _subscribeToSend(): void {
        this._directService.sendScheduleState.pipe(
            takeUntil(this._unsubscribe$)
        ).subscribe((message: string) => {
            this._sendSchedule(message)
        })
    }

    private _sendSchedule(typedMessage: string): void {
        this._loadingService.showLoading();
        const signatureGroup = this.signatureGroup.value
        const sendingData: NewMailing = {
            accountId: this._authService.getAccount().id,
            delay: signatureGroup.delayedSending ? signatureGroup.delayedSendingTime * 60 : null,
            filter: signatureGroup.applyForSubscribers ? this._autoSubscribeOrWatchStoryService.settings.filter : {},
            messages: this.files.length > 0 ? this.files : Array(typedMessage),
            sendAfterFollow: signatureGroup.sendAfterSubscription
        }
        this._directService.postNewUserMailings(sendingData).pipe(
            finalize(() => this._loadingService.hideLoading()),
            takeUntil(this._unsubscribe$)
        ).subscribe((data) => {
            this.signatureGroup.reset();
            this._directService.updateMailing.next()
        })
    }

    private _openFiltersModal(): void {
        this._matDialog.open(AudienceFilterComponent, {
            maxWidth: '80%',
            height: '80%',
            maxHeight: '80%',
            position: {
                top: '120px'
            },
            data: { showButton: true }
        });
    }

    public onChangeTab(tab): void {
        this.tab = tab;
    }
    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}