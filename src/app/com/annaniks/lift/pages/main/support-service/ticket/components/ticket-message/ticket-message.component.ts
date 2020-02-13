import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TicketMessage } from '../../../../../../core/models/support-service';
import { User } from '../../../../../../core/models/user';
import { AuthService } from '../../../../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: '[app-ticket-message]',
    templateUrl: 'ticket-message.component.html',
    styleUrls: ['ticket-message.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TicketMessageComponent implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public user: User = {} as User;
    @Input('message') public ticketMessage: TicketMessage = {} as TicketMessage;

    constructor(private _authService: AuthService) {}

    ngOnInit() {
        this._authService.getUserState()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {
                this.user = data;
            })
    }

    ngOnDestroy() { }
}