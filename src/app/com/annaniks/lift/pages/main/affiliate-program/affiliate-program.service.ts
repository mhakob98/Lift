import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../../../core/models/server-response';
import { Observable } from 'rxjs';
import { AffiliateProgramOperation } from '../../../core/models/affiliate-program';

@Injectable()
export class AffiliateProgramService {

    constructor(private _httpClient: HttpClient) { }

    public getAffiliateProgramOperation(): Observable<ServerResponse<AffiliateProgramOperation[]>> {
        return this._httpClient.get<ServerResponse<AffiliateProgramOperation[]>>('tracking/refferal');
    }

}