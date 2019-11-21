import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, catchError, shareReplay } from 'rxjs/operators';
import { of } from 'rxjs';

import { Subscriber } from '../../../../core/models/subscriber';
import { Post } from '../../../../core/models/post';
import { ServerResponse } from '../../../../core/models/server-response';

@Injectable()
export class SubscribesPostsService {


    subscribers$ = this.httpClient.get<ServerResponse<Subscriber[]>>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(
            tap(console.log),
            shareReplay(),
            catchError(of)
        )
    mySubscribes$ = this.httpClient.get<ServerResponse<Subscriber[]>>('my-subscribes')
        .pipe(
            tap(console.log),
            shareReplay(),
            catchError(of)
        )
    posts$ = this.httpClient.get<ServerResponse<Post[]>>('posts')
        .pipe(
            tap(console.log),
            shareReplay(),
            catchError(of)
        )
    constructor(private httpClient: HttpClient) { }

}