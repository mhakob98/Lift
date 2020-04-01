import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse } from '../../../core/models/server-response';
import { MailingResponse } from '../../../core/models/direct';

@Injectable()
export class DirectService {

    constructor(private _httpClient: HttpClient) { }

    public getNewUserMailings(): Observable<ServerResponse<MailingResponse>> {
        return this._httpClient.get<ServerResponse<MailingResponse>>('mailing');
    }
}