import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangePasswordData, InformingService } from '../../../core/models/account-basic-settings';
import { ChangeMe } from '../../../core/models/change-me';
import { ServerResponse } from '../../../core/models/server-response';
import { EmptyResponse } from '../../../core/models/empty-response';

@Injectable()
export class ProfileService {

    constructor(private _httpClient: HttpClient) { }

    public changePassword(data: ChangePasswordData): Observable<ServerResponse<EmptyResponse>> {
        return this._httpClient.post<ServerResponse<EmptyResponse>>('change-password', data);
    }

    public changeMe(data: ChangeMe): Observable<ServerResponse<EmptyResponse>> {
        return this._httpClient.put<ServerResponse<EmptyResponse>>('me', data);
    }

    public changeUserPhoto(userPhoto: File): Observable<ServerResponse<EmptyResponse>> {
        const formData: FormData = new FormData();
        formData.append('photo', userPhoto);
        return this._httpClient.put<ServerResponse<EmptyResponse>>('me/avatar', formData);
    }

    public addInforming(settings: InformingService): Observable<ServerResponse<InformingService>> {
        return this._httpClient.post<ServerResponse<InformingService>>('informing', settings);
    }

    public getInforming(id: number): Observable<ServerResponse<InformingService>> {
        return this._httpClient.get<ServerResponse<InformingService>>(`informing/${id}`)
    }
}