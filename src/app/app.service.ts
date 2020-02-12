import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServerResponse } from './com/annaniks/lift/core/models/server-response';
import { JoinRequestData } from './com/annaniks/lift/core/models/join';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {

    constructor(private _httpClient: HttpClient) { }

    public getTrackingByReferalCode(joinRequest: JoinRequestData): Observable<ServerResponse<any>> {
        let params = new HttpParams();
        params = params.set('authorization', 'false');
        return this._httpClient.post<ServerResponse<any>>('tracking', joinRequest,{ params })
    }
}