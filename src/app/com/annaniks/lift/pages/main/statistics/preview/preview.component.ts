import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatisticsService } from '../statistics.service';
import { StatisticsData, Statistic, PostStatistic, StatisticValue, LineChartData } from '../../../../core/models/statistics';
import { Subject, forkJoin, Observable } from 'rxjs';
import { takeUntil, map, finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { LoadingService } from '../../../../core/services/loading-service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public statistics: Statistic[] = [];
  public postsCount: StatisticValue = {} as StatisticValue;
  public followingsCount: StatisticValue = {} as StatisticValue;
  public followersCount: StatisticValue = {} as StatisticValue;
  public commentsCount: StatisticValue = {} as StatisticValue;
  public todayPostsCount: StatisticValue = {} as StatisticValue;
  public likesCount: StatisticValue = {} as StatisticValue;
  public postStatistics: PostStatistic[] = [];
  public followersChartLabels: string[] = [];
  public followersChartData: LineChartData[] = [];
  public likesChartLabels: string[] = [];
  public likesChartData: LineChartData[] = [];

  public loading: boolean = false;

  public slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: false,
    infinite: false,
    speed: 300,
    loop: false,
    autoplay: false,
    autoplayTimeout: 1000,
    autoplayHoverPause: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  }

  constructor(
    private _statisticsServcie: StatisticsService,
    private _authService: AuthService,
    private _datePipe: DatePipe,
    private _loadingService: LoadingService
  ) { }

  ngOnInit() {
    this._getPreviewData();
  }

  private _getPreviewData(): void {
    this.loading = true;
    this._loadingService.showLoading();
    const { id } = this._authService.getAccount();
    const endDate = new Date();

    const startDate = new Date(new Date().setMonth(endDate.getMonth() - 1))

    const allStatisticsData: StatisticsData = {
      accountId: id,
      startDate: startDate,
      endDate: endDate
    }
    const joined = forkJoin(
      this._getAllStatistics(allStatisticsData),
      this._getLikesAndComments(allStatisticsData),
      this._getStatisticsPosts(allStatisticsData)
    )
    joined
      .pipe(
        takeUntil(this._unsubscribe$),
        finalize(() => { this.loading = false; this._loadingService.hideLoading() })
      )
      .subscribe()

  }

  private _getAllStatistics(allStatisticsData: StatisticsData): Observable<void> {
    return this._statisticsServcie.getAllStatistics(allStatisticsData)
      .pipe(
        takeUntil(this._unsubscribe$),
        map((data) => {
          const statistics: Statistic[] = data.data;
          this.followersChartLabels = statistics.map((element) => {
            return this._datePipe.transform(element.date, 'dd/MM/yyyy');
          })

          const followers = statistics.map((element) => {
            return element.followers;
          })

          this.followersChartData.push({
            data: followers,
            label: 'Folowers',
            borderColor: '#3399cc',
            backgroundColor: '#3399cc8f'
          })

          this.postsCount = this._countStatistics('postsCount', statistics);
          this.followingsCount = this._countStatistics('followings', statistics);
          this.followersCount = this._countStatistics('followers', statistics);
        })
      )
  }

  private _getLikesAndComments(allStatisticsData: StatisticsData): Observable<void> {
    return this._statisticsServcie.getStatisticsLikesComments(allStatisticsData)
      .pipe(
        takeUntil(this._unsubscribe$),
        map((data) => {
          const statistics = data.data;

          this.likesChartLabels = statistics.map((element) => {
            return this._datePipe.transform(element.date, 'dd/MM/yyyy');
          })

          const likes = statistics.map((element) => {
            return element.like;
          })

          this.likesChartData.push({
            data: likes,
            label: 'Likes',
            borderColor: '#3399cc',
            backgroundColor: '#3399cc8f'
          })

          this.commentsCount = this._countStatistics('comment', statistics);
          this.likesCount = this._countStatistics('like', statistics);
        })
      )
  }

  private _getStatisticsPosts(statisticsData: StatisticsData): Observable<void> {
    return this._statisticsServcie.getStatisticsPosts(statisticsData)
      .pipe(
        map((data) => {
          const statistics = data.data;
          this.postStatistics = statistics;
        })
      )
  }

  private _countStatistics(key: string, array: any[]): { value: number, todayCount: number } {
    const today = new Date();
    let value: number = 0;
    let todayCount: number = 0
    array.map((element, index) => {
      value += element[key];
      if (element.day === today.getDate() - 1) {
        todayCount += element[key];
      }
    })
    return { value, todayCount };
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
