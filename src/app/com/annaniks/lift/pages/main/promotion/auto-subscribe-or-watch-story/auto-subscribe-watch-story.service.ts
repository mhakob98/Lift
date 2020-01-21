import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJs 
import { catchError } from 'rxjs/operators';
import { of, Observable, BehaviorSubject, Subject } from 'rxjs';
// Interfaces
import { AudienceFilter } from '../../../../core/models/audience-filter';
import { ActionAfterSubscription } from '../../../../core/models/action-after-subscription';
import { SuitableSettingsRequest } from '../../../../core/models/suitable-settings-request';
import { EmptyResponse } from '../../../../core/models/empty-response';
import { ServerResponse } from '../../../../core/models/server-response';
import { Coordinates } from '../../../../core/models/coordinates';
import { Search, SearchTerm } from '../../../../core/models/search';

@Injectable()
export class AutoSubscribeOrWatchStoryService {
    public selectedHashtags = []
    public selectedLocations = []
    public selectedSubscribes = []
    public commentTo = []
    public likesTo = []
    public subscribesTo = []
    public addedConditionsSubject$ = new Subject<{ prev: string, next: string }>();
    public addedConditionsObservable$ = new Observable<{ prev: string, next: string }>();

    public addedConditions: string[] = []

    public fetchAllFilters$ = this.httpClient.get<ServerResponse<AudienceFilter[]>>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(catchError(of))

    public fetchAllActions$ = this.httpClient.get<ServerResponse<ActionAfterSubscription[]>>('http://dummy.restapiexample.com/api/v1/employees')
        .pipe(catchError(of))



    constructor(private httpClient: HttpClient) {
        this.addedConditionsObservable$ = this.addedConditionsSubject$.asObservable();
    }

    public searchFor(searchTerm: SearchTerm): Observable<ServerResponse<Search>> {
        return this.httpClient.get<ServerResponse<Search>>(`instagram-search/${searchTerm.query}/${searchTerm.type}`)
    }

    public saveSettings(settings): Observable<ServerResponse<EmptyResponse>> {
        return this.httpClient.post<ServerResponse<EmptyResponse>>('massfollowing', settings)
    }

}