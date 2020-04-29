import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, forkJoin } from 'rxjs';
import { takeUntil, switchMap, map, finalize } from 'rxjs/operators';
import { StatisticsService } from '../statistics.service';
import { AuthService, LoadingService } from '../../../../core/services';
import { StatisticsData, PostStatistic, LineChartData, Statistic } from '../../../../core/models/statistics';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Chart } from 'chart.js';

declare var google: any;

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribes-posts.component.html',
  styleUrls: ['./subscribes-posts.component.scss'],
})
export class SubscribersPostsComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  private _map: any;
  private _pieChart;
  public loading: boolean = false;
  public lineChartSize: { width: string, height: string } = { width: '100%', height: '381px' };
  public type: string;
  public label: string;
  public statistics: PostStatistic[] = [];

  public chartLabels: string[] = [];
  public chartData: LineChartData[] = [];
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];

  public startDateControl: FormControl = new FormControl();
  public endDateControl: FormControl = new FormControl();
  public showDataKey: string;
  public segmentData: any;
  public isBusinessAccount: boolean = false;
  public activePieChartDataType: string = 'gender';

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

    this._authService.getActiveAccount()
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap((data) => {
          const routeData = this._activatedRoute.snapshot.data;
          this.label = routeData.label;
          this.showDataKey = routeData && routeData.showDataKey ? routeData.showDataKey : null;
          this.type = routeData.type;
          return this._getStatistics();
        })
      ).subscribe()

  }

  ngOnInit() {
    this._handleControlChanges();
  }

  private _initMap(corrdinates = { lat: 40.7865229, lng: 43.8476395 }, zoom = 15): void {
    this._map = new google.maps.Map(document.getElementById("map"), {
      zoom: zoom,
      center: corrdinates,
      disableDefaultUI: true
    });
  }

  private _iniptPieChart(): void {
    var ctx = document.getElementById('myChart');
    this._pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.pieChartLabels,
        datasets: [{
          label: '# of Votes',
          data: this.pieChartData,
          borderWidth: 0,
          backgroundColor: [
            '#edb593',
            '#e5d2aa',
            '#737a7f',
            '#9dceaa',
            '#95b8c8',
          ],

        }]
      },
      options: {
        legend: {
          position: 'right',
          responsive: false,
          labels: {
            fontFamily: 'SF UI Display Regular',
            fontSize: 26,
            padding: 50,
            usePointStyle: true,
          },
        },
        tooltips: {
          enabled: true,
          bodyFontSize: 24,
          bodyFontFamily: 'SF UI Display Regular'
        }
      }
    });

  }

  private _getStatistics(): Observable<void> {
    this.chartLabels = [];
    this.chartData = [];
    this.isBusinessAccount = false;
    this.segmentData = null;
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
          const allStatistics = data.data;
          const statistics: Statistic[] = allStatistics.statistics;
          this.isBusinessAccount = allStatistics.segment && Object.keys(allStatistics.segment).length > 0;
          if (this.isBusinessAccount) {
            this.segmentData = allStatistics.segment;
            // this._initMap();
            this._iniptPieChart();
            this._setPieChartData();

          }
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

  private _setPieChartData(): void {
    this.pieChartLabels = [];
    this.pieChartData = [];
    if (this.type === 'subscribers') {
      const statisticsData = this.segmentData.followers_unit;
      console.log(this.segmentData.followers_unit);
      let propKey: string = '';
      if (this.activePieChartDataType === 'country') {
        propKey = 'followers_top_countries_graph';
      }
      if (this.activePieChartDataType === 'gender') {
        propKey = 'gender_graph';
      }
      if (this.activePieChartDataType === 'age') {
        propKey = 'all_followers_age_graph';
      }
      if (this.activePieChartDataType === 'city') {
        propKey = 'followers_top_cities_graph';
      }
      const data = statisticsData[propKey].data_points || [];
      data.map((element) => {
        this.pieChartLabels.push(element.label);
        this.pieChartData.push(element.value);
      })
      this._pieChart.data.labels = this.pieChartLabels;
      this._pieChart.data.datasets[0].data = this.pieChartData;
    }
    this._pieChart.update();
  }

  public onClickPieChartHeading(type: string): void {
    this.activePieChartDataType = type;
    this._setPieChartData();
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
