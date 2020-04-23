import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatisticsService } from '../statistics.service';
import { StatisticsData, Statistic, PostStatistic } from '../../../../core/models/statistics';
import { Subject, forkJoin, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { getDate } from 'date-fns';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public statistics: Statistic[] = [];
  public postsCount: number = 0;
  public followingsCount: number = 0;
  public followersCount: number = 0;
  public commentsCount: number = 0;
  public todayPostsCount: number = 0;
  public likesCount: number = 0;
  public postStatistics: PostStatistic[] = [];

  public slider = [
    {},
    {},
    {},
    {},
    {},
  ]
  public slide1: boolean = true;
  public slide2: boolean = true;
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
    // prevArrow: "<img class='a-left control-c prev slick-prev'  src='/assets/images/arrow-left.png' >",
    // nextArrow: "<img class='a-right control-c next slick-next' src='/assets/images/arrow-right.png'>",
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
    private _authService: AuthService
  ) { }

  ngOnInit() {
    this._getPreviewData();
  }

  private _getPreviewData(): void {
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
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe()

  }

  private _getAllStatistics(allStatisticsData: StatisticsData): Observable<void> {
    return this._statisticsServcie.getAllStatistics(allStatisticsData)
      .pipe(
        takeUntil(this._unsubscribe$),
        map((data) => {
          const statistics: Statistic[] = data.data;
          const { value, todayCount } = this._countStatistics('postsCount', statistics);
          this.postsCount = value;
          this.todayPostsCount = todayCount;
          this.followingsCount = this._countStatistics('followings', statistics).value;
          this.followersCount = this._countStatistics('followers', statistics).value;
        })
      )
  }

  private _getLikesAndComments(allStatisticsData: StatisticsData): Observable<void> {
    return this._statisticsServcie.getStatisticsLikesComments(allStatisticsData)
      .pipe(
        takeUntil(this._unsubscribe$),
        map((data) => {
          const statistics = data.data;
          this.commentsCount = this._countStatistics('comment', statistics).value;
          this.likesCount = this._countStatistics('like', statistics).value;
        })
      )
  }

  private _getStatisticsPosts(statisticsData: StatisticsData): Observable<void> {
    return this._statisticsServcie.getStatisticsPosts(statisticsData)
      .pipe(
        map((data) => {
          const statistics = data.data;
          console.log(statistics);
          this.postStatistics = data.data;
        })
      )
  }

  public closeSlider(tab: number): void {
    if (tab == 1) {
      this.slide1 = !this.slide1;
    }
    else if (tab == 2) {
      this.slide2 = !this.slide2;
    }
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
