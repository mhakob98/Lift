import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatisticsService } from '../statistics.service';
import { StatisticsData, Statistic, PostStatistic, StatisticValue, LineChartData } from '../../../../core/models/statistics';
import { Subject, forkJoin, Observable } from 'rxjs';
import { takeUntil, map, finalize, switchMap, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { LoadingService } from '../../../../core/services/loading-service';
import { TariffData } from '../../../../core/models/tariff';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SubscriptionData } from '../../../../core/models/account';
import { MainService } from '../../main.service';
import { ToastrService } from 'ngx-toastr';
import { InstagramAccount } from '../../../../core/models/user';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  private _activeAccount: InstagramAccount;
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
  public currentStatistic = {
    posts: 0,
    followers: 0,
    followings: 0
  }
  public tariffInfo: TariffData;
  public subscriptionForm: FormGroup;

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
    private _loadingService: LoadingService,
    private _fb: FormBuilder,
    private _mainService: MainService,
    private _toastrService: ToastrService
  ) { }

  ngOnInit() {
    this._initForm();
    this._authService.getActiveAccount()
      .pipe(
        takeUntil(this._unsubscribe$),
        mergeMap((account) => {
          this._activeAccount = account;
          this._setSubscriptionValues()
          return this._getPreviewData();
        })
      ).subscribe();
  }

  private _getPreviewData(): Observable<void> {
    this.loading = true;
    this._loadingService.showLoading();

    const { tariffs } = this._authService.getUserStateSync();
    this.tariffInfo = tariffs[0];

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
    return joined
      .pipe(
        takeUntil(this._unsubscribe$),
        finalize(() => { this.loading = false; this._loadingService.hideLoading() }),
        map(_ => { })
      )

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

  private _initForm(): void {
    this.subscriptionForm = this._fb.group({
      autosubscription: [false],
      autoreviewstories: [false],
      bonus: [false]
    })
    this.subscriptionForm.valueChanges
      .pipe(
        switchMap(() => this._setSubscriptionType())
      )
      .subscribe();
  }

  private _setSubscriptionValues(): void {
    this.subscriptionForm.patchValue({
      autosubscription: this._activeAccount.subscription.autoFollowing,
      autoreviewstories: this._activeAccount.subscription.autoView,
      bonus: this._activeAccount.subscription.liftBonus
    }, { emitEvent: false })
  }

  private _setSubscriptionType(): Observable<void> {
    const sendingData: SubscriptionData = {
      autoFollowing: this.subscriptionForm.get('autosubscription').value,
      autoView: this.subscriptionForm.get('autoreviewstories').value,
      liftBonus: this.subscriptionForm.get('bonus').value,
      loginId: this._authService.getAccount().id
    }
    return this._mainService.setSubscriptionType(sendingData)
      .pipe(
        map(() => {
          this._toastrService.success('Изменения сохранены !')
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

  private _countStatistics(key: string, array: any[]): StatisticValue {
    let value: number = 0;
    let todayCount: number = 0;
    let icon: string;
    if (array && array.length && array.length >= 1) {
      let lastDay = array[array.length - 1];
      let beforYesterday;
      value = lastDay[key];
      try {
        beforYesterday = array[array.length - 2];
        todayCount = lastDay[key] - beforYesterday[key];
      } catch (error) {
        todayCount = lastDay[key];
      }
    }
    if (todayCount >= 0) {
      icon = 'assets/images/preview_up_icon.png';
    }
    else {
      icon = 'assets/images/preview_down_icon.png';
    }
    return { value, todayCount, icon };

  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
