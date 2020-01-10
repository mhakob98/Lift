import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SubscribesPostsService } from './subscribes-posts.service';

import { catchError, map, filter, first } from 'rxjs/operators';
import { of, combineLatest, Observable } from 'rxjs';
import { Subscriber } from '../../../../core/models/subscriber';
import { ActivatedRoute } from '@angular/router';
import { Subscribe } from '../../../../core/models/subscribe';
import { StatisticPost } from '../../../../core/models/statistic-post';

import { EChartOption } from 'echarts';
declare var google: any;

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribes-posts.component.html',
  styleUrls: ['./subscribes-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribersPostsComponent implements OnInit {

  private _data$: Observable<Subscriber | Subscribe | StatisticPost>;
  private _dataByDate$: Observable<any>;
  private _dataByDays$: Observable<any>;
  public vm$: Observable<any>;
  private _map: any;

  lineChartOption: EChartOption = {

    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      },
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      }
    },
    series: [{
      data: [0, 500, 1000, 1500, 0, 2500, 3000, 3500, 4000, 4500, 5000],
      type: 'line'
    }]
  }







  pieChartOption = {
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 40,
      top: 'center',
      borderRadius: 5,
      textStyle: { color: '#3d3d3d', fontSize: 16 },
      // bottom: 20,

    },
    calculable: true,

    series: [
      {
        name: '姓名',
        type: 'pie',
        radius: ['39px', '166px'],
        center: ['185px', '50%'],
        data: [
          { value: 335, name: 'Параметр - 21.44%' },
          { value: 310, name: 'Параметр - 19.84%' },
          { value: 234, name: 'Параметр - 14.98%' },
          { value: 135, name: 'Параметр - 8.64%' },
          { value: 548, name: 'Параметр - 35.08%' }
        ],
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,

          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },

      }
    ]
  };
  constructor(
    private _subscribersService: SubscribesPostsService,
    _activatedRoute: ActivatedRoute
  ) {
    _activatedRoute.data.subscribe((data: { type: string }) => {
      this._data$ = this._loadPreferedDataBasedOnPageType(data.type).pipe(catchError(of))
      this._initializeStreams();
    })
  }

  ngOnInit() {
    this.vm$.subscribe((data) => {
      console.log(data);
      if (data) this._initMap()
    })
  }

  private _initMap(corrdinates = { lat: 40.7865229, lng: 43.8476395 }, zoom = 15): void {
    this._map = new google.maps.Map(document.getElementById("map"), {
      zoom: zoom,
      center: corrdinates,
      disableDefaultUI: true
    });
  }


  private _loadPreferedDataBasedOnPageType(pageType: string): Observable<Subscriber | Subscribe | StatisticPost> {
    switch (pageType) {
      case 'subscribers':
        return this._subscribersService.subscribers$
      case 'my-subscribes':
        return this._subscribersService.mySubscribes$
      case 'posts':
        return this._subscribersService.posts$
      default:
        break;
    }
  }
  private _initializeStreams(): void {
    this._dataByDate$ = this._data$
      .pipe(
        map((s: Subscriber) => s ? s.subscribersStatisticByDate : null),
        catchError(of)
      )
    this._dataByDays$ = this._data$
      .pipe(
        map((s: Subscriber) => s ? s.subscribersStatisticByDays : null),
        catchError(of)
      )
    this.vm$ = combineLatest(
      [this._data$,
      this._dataByDate$,
      this._dataByDays$])
      .pipe(
        filter(([data]) => !!data),
        map(([data, dataByDate, dataByDays]) =>
          ({ data, dataByDate, dataByDays }))
      )
  }

}
