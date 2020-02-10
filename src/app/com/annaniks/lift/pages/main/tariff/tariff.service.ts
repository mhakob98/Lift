import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TariffOperation, Tariff } from '../../../core/models/tariff';
import { ServerResponse } from '../../../core/models/server-response';


@Injectable()

export class TariffService {

    constructor(private _httpClient: HttpClient) { }


    public getTariff(): Observable<ServerResponse<Tariff[]>> {
        return this._httpClient.get<ServerResponse<Tariff[]>>('')
    }

    public getTariffOpetation(): Observable<ServerResponse<TariffOperation[]>> {
        return this._httpClient.get<ServerResponse<TariffOperation[]>>('')
    }
}