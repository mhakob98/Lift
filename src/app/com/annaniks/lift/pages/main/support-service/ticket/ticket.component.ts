import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { TicketService } from './ticket.service';
import { Ticket, TicketMessage, WriteTicketMessageData } from '../../../../core/models/support-service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-ticket',
    templateUrl: 'ticket.component.html',
    styleUrls: ['ticket.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TicketComponent implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    private _ticketId: string;
    public ticket: Ticket = {} as Ticket;
    public messages: TicketMessage[] = [];
    public messageForm: FormGroup;
    @ViewChild('msgContainer', { static: false }) public msgContainer: ElementRef;


    constructor(
        private _ticketService: TicketService,
        private _activatedRoute: ActivatedRoute,
        private _fb: FormBuilder,
        private _toastrService: ToastrService
    ) { }

    ngOnInit() {
        this._initForm();
        this._getTicketById();
    }

    private _getTicketById(): void {
        this._ticketId = this._activatedRoute.snapshot.paramMap.get('ticketId') || '';
        this._ticketService.getTicketById(this._ticketId)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {
                this.ticket = data.data;
                this.messages = this.ticket.messages;
            })
    }

    private _initForm(): void {
        this.messageForm = this._fb.group({
            message: [null, Validators.required]
        })
    }

    private _sendMessage(): void {
        const writeMessageData: WriteTicketMessageData = {
            ticketId: Number(this._ticketId),
            message: this.messageForm.get('message').value,
        }
        this._ticketService.writeMessage(writeMessageData)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(
                (data) => {
                    const message: TicketMessage = data.data;
                    this.messages.push(message);
                    this.messageForm.get('message').reset();
                    this._toastrService.success('Сообщение успешно отправлено');
                },
                (err) => {
                    const error = err.error;
                    const errorMessage: string = error.message || 'Ошибка';
                    this._toastrService.error(errorMessage);

                })
    }

    public onClickSend(): void {
        if (this.messageForm.valid) {
            this._sendMessage();
        }
    }



    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}