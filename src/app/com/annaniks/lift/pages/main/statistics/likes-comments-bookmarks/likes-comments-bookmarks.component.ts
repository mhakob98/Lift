
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

import { FormControl } from '@angular/forms';
import { StatisticsService } from '../statistics.service';
import { switchMap, takeUntil, map, finalize } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { StatisticsData, LikesCommentsStatistic } from '../../../../core/models/statistics';
import { LoadingService } from '../../../../core/services/loading-service';

@Component({
  selector: 'app-likes-comments-bookmarks',
  templateUrl: './likes-comments-bookmarks.component.html',
  styleUrls: ['./likes-comments-bookmarks.component.scss']
})
export class LikesCommentsBookmarksComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  private _fullStatistics: LikesCommentsStatistic[] = [];
  private _page: number = 1;
  private _pageLength: number = 7;

  public statistics: LikesCommentsStatistic[] = [];
  public dataKeyForPosts: string;
  public startDateControl: FormControl = new FormControl();
  public endDateControl: FormControl = new FormControl();
  public isShowLoadMore: boolean = true;
  public type: string;

  startDateFilter = (date: Date) => this.endDateControl.value.getTime() > date.getTime();
  endDateFilter = (date: Date) => this.startDateControl.value.getTime() < date.getTime();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _statisticsService: StatisticsService,
    private _loadingService: LoadingService
  ) {
    const endDate = new Date();
    const startDate = new Date(new Date().setMonth(endDate.getMonth() - 1));

    this.startDateControl.patchValue(startDate);
    this.endDateControl.patchValue(endDate);

    this.type = this._activatedRoute.snapshot.data.type;
    this.dataKeyForPosts = this.type === 'likes' ? 'topLike' : 'topComment';

  }

  ngOnInit() {
    this._getStatistics().subscribe();
    this._handleControlChanges();
  }

  private _getStatistics(): Observable<void> {
    this.isShowLoadMore = true;
    this._loadingService.showLoading();

    const startDate = this.startDateControl.value;
    const endDate = this.endDateControl.value;

    const { id } = this._authService.getAccount();

    const statisticsPeriod: StatisticsData = {
      accountId: id,
      startDate: startDate,
      endDate: endDate
    }
    return this._statisticsService.getStatisticsLikesComments(statisticsPeriod)
      .pipe(
        takeUntil(this._unsubscribe$),
        finalize(() => this._loadingService.hideLoading()),
        map((data) => {
          this._fullStatistics = data.data;
          this.statistics = this._fullStatistics.slice(0, this._page * this._pageLength)
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

  public onClickLoadMore(): void {
    this._page++;
    this.statistics = this._fullStatistics.slice(0, this._page * this._pageLength);
    if (this.statistics.length === this._fullStatistics.length) {
      this.isShowLoadMore = false;
    }
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
