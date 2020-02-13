import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse } from '../../../core/models/server-response';
import { EmptyResponse } from '../../../core/models/empty-response';
import { AllTicketsResponse } from '../../../core/models/support-service';

@Injectable()
export class SupportService {

    constructor(private _httpClient: HttpClient) { }

    public createTicket(createTicketData): Observable<ServerResponse<EmptyResponse>> {
        const formData: FormData = new FormData();
        if (createTicketData) {
            const keys = Object.keys(createTicketData) || [];
            keys.map((element, index) => {
                formData.append(element, createTicketData[element]);
            })
        }
        return this._httpClient.post<ServerResponse<EmptyResponse>>('support', formData);
    }

    public getAllTickets(): Observable<ServerResponse<AllTicketsResponse>> {
        return this._httpClient.get<ServerResponse<AllTicketsResponse>>('support/tickets');
    }
}