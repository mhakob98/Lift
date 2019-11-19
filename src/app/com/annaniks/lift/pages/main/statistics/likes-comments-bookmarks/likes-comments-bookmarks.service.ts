import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, catchError, shareReplay } from 'rxjs/operators';
import { of } from 'rxjs';

import { Bookmark } from '../../../../core/models/bookmark';
import { Comment } from '../../../../core/models/comment';
import { Like } from '../../../../core/models/like';

@Injectable()
export class LikesCommentsBookmarksService {

    constructor(private httpClient: HttpClient) { }

    likes$ = this.httpClient.get<Like[]>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(
            tap(console.log),
            shareReplay(),
            catchError(of)
        )
    comments$ = this.httpClient.get<Comment[]>('my-subscribes')
        .pipe(
            tap(console.log),
            shareReplay(),
            catchError(of)
        )
    bookmarks$ = this.httpClient.get<Bookmark[]>('posts')
        .pipe(
            tap(console.log),
            shareReplay(),
            catchError(of)
        )
}