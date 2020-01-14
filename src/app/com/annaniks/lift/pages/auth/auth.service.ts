import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmptyResponse } from '../../core/models/empty-response';
import { HttpClient } from '@angular/common/http';
import { BasicUser } from '../../core/models/basic-user';
import { ServerResponse } from '../../core/models/server-response';

@Injectable()
export class AuthService {

    constructor(
        private httpClient: HttpClient
    ) { }

    public register(user: BasicUser): Observable<ServerResponse<EmptyResponse>> {
        return this.httpClient.post<ServerResponse<EmptyResponse>>('register', user)
    }
}