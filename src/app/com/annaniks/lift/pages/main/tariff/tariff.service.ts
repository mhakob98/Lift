import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TariffTransaction, Tariff } from '../../../core/models/tariff';
import { ServerResponse } from '../../../core/models/server-response';


@Injectable()

export class TariffService {

    constructor(private _httpClient: HttpClient) { }


    public getTariff(): Observable<ServerResponse<Tariff[]>> {
        return this._httpClient.get<ServerResponse<Tariff[]>>('')
    }

    public getTariffTransaction(): Observable<ServerResponse<TariffTransaction[]>> {
        return this._httpClient.get<ServerResponse<TariffTransaction[]>>('tariff/transaction')
    }
}