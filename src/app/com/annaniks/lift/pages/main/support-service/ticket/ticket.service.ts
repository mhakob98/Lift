import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, WriteTicketMessageData, TicketMessage } from '../../../../core/models/support-service';
import { ServerResponse } from '../../../../core/models/server-response';

@Injectable()
export class TicketService {

    constructor(private _httpClient: HttpClient) { }

    public getTicketById(ticketId: string): Observable<ServerResponse<Ticket>> {
        return this._httpClient.get<ServerResponse<Ticket>>(`support/ticket/${ticketId}`)
    }

    public writeMessage(writeMessageData: WriteTicketMessageData): Observable<ServerResponse<TicketMessage>> {
        const formData: FormData = new FormData();
        if (writeMessageData) {
            const keys = Object.keys(writeMessageData);
            keys.map((element, index) => {
                if (writeMessageData[element]) {
                    formData.append(element, writeMessageData[element]);
                }
            })
        }
        return this._httpClient.post<ServerResponse<TicketMessage>>('support/ticket/message', formData)
    }
}