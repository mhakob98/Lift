import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, switchMap, map, finalize } from 'rxjs/operators';
import { StatisticsService } from '../statistics.service';
import { AuthService } from '../../../../core/services/auth.service';
import { StatisticsData, PostStatistic, LineChartData } from '../../../../core/models/statistics';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

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
  public statistics: PostStatistic[] = [];
  public chartLabels: string[] = [];
  public chartData: LineChartData[] = [];
  public startDateControl: FormControl = new FormControl();
  public endDateControl: FormControl = new FormControl();

  startDateFilter = (date: Date) => this.endDateControl.value.getTime() > date.getTime();
  endDateFilter = (date: Date) => this.startDateControl.value.getTime() < date.getTime();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _statisticsService: StatisticsService,
    private _authService: AuthService,
    private _datePipe: DatePipe
  ) {
    const endDate = new Date();
    const startDate = new Date(new Date().setMonth(endDate.getMonth() - 1));

    this.startDateControl.patchValue(startDate);
    this.endDateControl.patchValue(endDate);

    this._activatedRoute.data
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap((data: { type: string }) => {
          this.type = data.type;
          if (data.type === "posts") {
            return this._getPostsStatistics();
          }
          return of([]);
        })
      ).subscribe()
  }

  ngOnInit() {
    this._handleControlChanges();
  }

  private _getPostsStatistics(): Observable<void> {
    this.loading = true;
    this.chartLabels = [];
    this.chartData = [];

    const { id } = this._authService.getAccount();

    const startDate = this.startDateControl.value;
    const endDate = this.endDateControl.value;

    const allStatisticsData: StatisticsData = {
      accountId: id,
      startDate: startDate,
      endDate: endDate
    }
    return this._statisticsService.getStatisticsPosts(allStatisticsData)
      .pipe(
        takeUntil(this._unsubscribe$),
        finalize(() => this.loading = false),
        map((data) => {
          this.statistics = data.data;
          const likes: number[] = [];
          const comments: number[] = [];

          let day = 1;

          this.statistics.map((element) => {
            likes.push(element.like);
            comments.push(element.comment);

            const date = `${day}/12/18`;
            this.chartLabels.push(date);

            day++;
          })
          this.chartData.push({
            data: likes,
            label: "Likes",
            borderColor: '#3399cc',
            backgroundColor: '#3399cc8f'
          })
          this.chartData.push({
            data: comments,
            label: "Comments",
            borderColor: '#17a2b8',
            backgroundColor: '#17a2b88f'
          })
        })
      )
  }

  private _handleControlChanges(): void {
    this.startDateControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap((value) => {
          return this._getPostsStatistics();
        })
      ).subscribe()

    this.endDateControl.valueChanges.pipe(
      takeUntil(this._unsubscribe$),
      switchMap((value) => {
        return this._getPostsStatistics();
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
