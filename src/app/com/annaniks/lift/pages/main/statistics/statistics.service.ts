import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StatisticsData, Statistic, LikesCommentsStatistic, PostStatistic } from '../../../core/models/statistics';
import { ServerResponse } from '../../../core/models/server-response';

@Injectable()
export class StatisticsService {

    constructor(private _httpClient: HttpClient) { }

    public getAllStatistics(allStatisticsData: StatisticsData): Observable<ServerResponse<Statistic[]>> {
        return this._httpClient.post<ServerResponse<Statistic[]>>('statistics/all', allStatisticsData);
    }

    public getStatisticsLikesComments(statisticsData: StatisticsData): Observable<ServerResponse<LikesCommentsStatistic[]>> {
        return this._httpClient.post<ServerResponse<LikesCommentsStatistic[]>>('statistics/likes-and-comments', statisticsData)
    }

    public getStatisticsPosts(statisticsData: StatisticsData): Observable<ServerResponse<PostStatistic[]>> {
        return this._httpClient.post<ServerResponse<PostStatistic[]>>('statistics/posts', statisticsData)
    }
}