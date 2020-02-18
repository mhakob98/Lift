import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse } from '../../../core/models/server-response';
import { ArticleFull } from '../../../core/models/article';

@Injectable()
export class ArticleDetailsService {

    constructor(private _httpClient: HttpClient) { }

    public getArticleById(articleId: string): Observable<ServerResponse<ArticleFull>> {
        let params = new HttpParams();
        params = params.set('id', articleId);
        return this._httpClient.get<ServerResponse<ArticleFull>>('article/get', { params })
    }
}