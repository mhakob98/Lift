import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SubscribesPostsService } from './subscribes-posts.service';

import { catchError, map, filter, first } from 'rxjs/operators';
import { of, combineLatest, Observable } from 'rxjs';
import { Subscriber } from '../../../../core/models/subscriber';
import { ActivatedRoute } from '@angular/router';
import { Subscribe } from '../../../../core/models/subscribe';
import { StatisticPost } from '../../../../core/models/statistic-post';
import { Chart } from 'chart.js';
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
  public lineChartSize: { width: string, height: string } = { width: '100%', height: '381px' }
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
      if (data) this._initMap();
    })
    this._iniptPieChart()
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
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [
          'Параметр -',
          'Параметр -',
          'Параметр -',
          'Параметр -',
          'Параметр -'
        ],
        datasets: [{
          label: '# of Votes',
          data: [335, 310, 234, 135, 548],
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
          labels: {
            fontFamily: 'SF UI Display Regular',
            fontSize: 26,
            padding: 50,
            usePointStyle: true,

          },
        },
        tooltips: {
          enabled: false
        }
      }
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
