import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, catchError, shareReplay } from 'rxjs/operators';
import { of } from 'rxjs';

import { Preview } from '../../../../core/models/statistics-preview';

@Injectable()
export class PreviewService {


    preview$ = this.httpClient.get<Preview>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(
            tap(console.log),
            shareReplay(),
            catchError(of)
        )
    constructor(private httpClient: HttpClient) { }
}