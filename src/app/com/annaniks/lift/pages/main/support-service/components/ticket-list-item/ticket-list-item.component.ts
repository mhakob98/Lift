import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-ticket-list-item',
    templateUrl: 'ticket-list-item.component.html',
    styleUrls: ['ticket-list-item.component.scss']
})
export class TicketListItemComponent implements OnInit {
    @Input('active') public active:boolean = false;

    constructor() { }

    ngOnInit() { }
}