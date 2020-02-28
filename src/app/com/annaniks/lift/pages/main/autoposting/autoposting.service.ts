import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePostData } from '../../../core/models/autoposting';
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
}