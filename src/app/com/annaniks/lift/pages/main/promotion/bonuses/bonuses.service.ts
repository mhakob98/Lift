import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJs 
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
// Interfaces
import { EmptyResponse } from '../../../../core/models/empty-response';
import { ServerResponse } from '../../../../core/models/server-response';
import { Bonus } from '../../../../core/models/bonus';
import { BonusSettings } from '../../../../core/models/bonus-settings';

@Injectable()
export class BonusesService {

    public fetchAllBonuses$ = this.httpClient.get<ServerResponse<Bonus[]>>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(catchError(of))

    public saveBonusesConfig(settings: BonusSettings): Observable<ServerResponse<EmptyResponse>> {
        return this.httpClient.post<ServerResponse<EmptyResponse>>('bonuses/save/settings', settings)
    }

    constructor(private httpClient: HttpClient) { }

}