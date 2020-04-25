import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, forkJoin } from 'rxjs';
import { takeUntil, switchMap, map, finalize } from 'rxjs/operators';
import { StatisticsService } from '../statistics.service';
import { AuthService } from '../../../../core/services/auth.service';
import { StatisticsData, PostStatistic, LineChartData, Statistic } from '../../../../core/models/statistics';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoadingService } from '../../../../core/services/loading-service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribes-posts.component.html',
  styleUrls: ['./subscribes-posts.component.scss'],
})
export class SubscribersPostsComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public loading: boolean = false;
  public lineChartSize: { width: string, height: string } = { width: '100%', height: '381px' };
  public type: string;
  public label: string;
  public statistics: PostStatistic[] = [];
  public chartLabels: string[] = [];
  public chartData: LineChartData[] = [];
  public startDateControl: FormControl = new FormControl();
  public endDateControl: FormControl = new FormControl();
  public showDataKey: string;

  startDateFilter = (date: Date) => this.endDateControl.value.getTime() > date.getTime();
  endDateFilter = (date: Date) => this.startDateControl.value.getTime() < date.getTime();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _statisticsService: StatisticsService,
    private _authService: AuthService,
    private _datePipe: DatePipe,
    private _loadingService: LoadingService
  ) {
    const endDate = new Date();
    const startDate = new Date(new Date().setMonth(endDate.getMonth() - 1));

    this.startDateControl.patchValue(startDate);
    this.endDateControl.patchValue(endDate);

    this._activatedRoute.data
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap((data: { type: string, showDataKey: string, label: string }) => {
          this.label = data.label;
          this.showDataKey = data && data.showDataKey ? data.showDataKey : null;
          this.type = data.type;
          return this._getStatistics();
        })
      ).subscribe()
  }

  ngOnInit() {
    this._handleControlChanges();
  }

  private _getStatistics(): Observable<void> {
    this.chartLabels = [];
    this.chartData = [];
    this.loading = true;

    this._loadingService.showLoading();
    const { id } = this._authService.getAccount();

    const startDate = this.startDateControl.value;
    const endDate = this.endDateControl.value;

    const statisticsPeriod: StatisticsData = {
      accountId: id,
      startDate: startDate,
      endDate: endDate
    }

    const requests = [this._getAllStatistics(statisticsPeriod)];

    if (this.type === "posts") {
      requests.push(this._getPostStatistics(statisticsPeriod))
    }

    const joined = forkJoin(requests)

    return joined
      .pipe(
        finalize(() => { this.loading = false; this._loadingService.hideLoading() }),
        map((_) => { })
      );
  }

  private _getPostStatistics(statisticsPeriod: StatisticsData): Observable<void> {
    return this._statisticsService.getStatisticsPosts(statisticsPeriod)
      .pipe(
        map((data) => {
          this.statistics = data.data;
        })
      )
  }

  private _getAllStatistics(statisticsPeriod: StatisticsData): Observable<void> {
    return this._statisticsService.getAllStatistics(statisticsPeriod)
      .pipe(
        map((data) => {
          const statistics: Statistic[] = data.data;
          const chartData = statistics.map((element, index) => {
            this.chartLabels.push(this._datePipe.transform(element.date, 'dd/MM/yyyy'));
            return element[this.showDataKey];
          })
          this.chartData.push({
            data: chartData,
            label: this.label,
            backgroundColor: "#3399cc8f",
            borderColor: "#3399cc"
          })
        })
      )

  }


  private _handleControlChanges(): void {
    this.startDateControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap((value) => {
          return this._getStatistics();
        })
      ).subscribe()

    this.endDateControl.valueChanges.pipe(
      takeUntil(this._unsubscribe$),
      switchMap((value) => {
        return this._getStatistics();
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
