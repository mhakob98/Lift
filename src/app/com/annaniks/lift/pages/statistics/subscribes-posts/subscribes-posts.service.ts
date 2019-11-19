import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, catchError, shareReplay } from 'rxjs/operators';
import { of } from 'rxjs';

import { Subscriber } from '../../../core/models/subscriber';
import { Post } from '../../../core/models/post';

@Injectable()
export class SubscribesPostsService {

    constructor(private httpClient: HttpClient) { }

    subscribers$ = this.httpClient.get<Subscriber[]>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(
            tap(console.log),
            shareReplay(),
            catchError(of)
        )
    mySubscribes$ = this.httpClient.get<Subscriber[]>('my-subscribes')
        .pipe(
            tap(console.log),
            shareReplay(),
            catchError(of)
        )
    posts$ = this.httpClient.get<Post[]>('posts')
        .pipe(
            tap(console.log),
            shareReplay(),
            catchError(of)
        )
}