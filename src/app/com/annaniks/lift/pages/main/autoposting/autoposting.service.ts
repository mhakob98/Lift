import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePostData, GetPostAndStoriesData, PostOrStory } from '../../../core/models/autoposting';
import { ServerResponse } from '../../../core/models/server-response';
import { UtilsService } from '../../../core/services/utils.service';

@Injectable()
export class AutoPostingService {

    constructor(private _httpClient: HttpClient) { }

    public createPost(data: CreatePostData): Observable<ServerResponse<any>> {
        const formData: FormData = UtilsService.createFormData(data);
        return this._httpClient.post<ServerResponse<any>>('auto-posting/post', formData);
    }

    public getPostsAndStoriesByMonth(data: GetPostAndStoriesData): Observable<ServerResponse<PostOrStory[]>> {
        const params = UtilsService.createHttpParams(data);
        return this._httpClient.get<ServerResponse<PostOrStory[]>>('auto-posting/by-month', { params })
    }
}