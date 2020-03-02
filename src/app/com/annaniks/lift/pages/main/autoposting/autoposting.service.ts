import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePostData, GetPostAndStoriesData } from '../../../core/models/autoposting';
import { ServerResponse } from '../../../core/models/server-response';

@Injectable()
export class AutoPostingService {

    constructor(private _httpClient: HttpClient) { }

    public createPost(data: CreatePostData): Observable<ServerResponse<any>> {
        const formData: FormData = new FormData();
        if (data) {
            const keys: string[] = Object.keys(data);
            keys.map((element, index) => {
                if (data[element] instanceof File) {
                    const file = data[element];
                    formData.append(element, file, file.name);
                }
                else {
                    formData.append(element, JSON.stringify(data[element]));
                }
            })
        }
        return this._httpClient.post<ServerResponse<any>>('', formData);
    }

    public getPostsAndStoriesByMonth(data: GetPostAndStoriesData): Observable<ServerResponse<any>> {
        let params = new HttpParams();
        const keys = Object.keys(data);
        if (keys && keys.length > 0) {
            keys.map((element: string, index: number) => {
                if (data[element]) {
                    params = params.append(element, data[element].toString())
                }
            })
        }
        return this._httpClient.get<ServerResponse<any>>('auto-posting/by-month', { params })
    }
}