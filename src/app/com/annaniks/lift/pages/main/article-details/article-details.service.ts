import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ServerResponse } from '../../../core/models/server-response';
import { ArticleDetails } from '../../../core/models/article-details';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class ArticleDetailsService {

    constructor(private _httpClinet: HttpClient) { }

    public articleUsefull(body: ArticleDetails): Observable<ServerResponse<ArticleDetails>> {
        return this._httpClinet.post<ServerResponse<ArticleDetails>>('article/useful', body)
    }

}