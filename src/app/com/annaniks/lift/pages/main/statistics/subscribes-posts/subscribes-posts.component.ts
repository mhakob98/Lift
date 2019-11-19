import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SubscribesPostsService } from './subscribes-posts.service';

import { catchError, map, filter } from 'rxjs/operators';
import { of, combineLatest, Observable } from 'rxjs';
import { Subscriber } from '../../../../core/models/subscriber';
import { ActivatedRoute } from '@angular/router';
import { Subscribe } from '../../../../core/models/subscribe';
import { Post } from '../../../../core/models/post';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribes-posts.component.html',
  styleUrls: ['./subscribes-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribersPostsComponent implements OnInit {

  private _data$: Observable<Subscriber | Subscribe | Post>;
  private _dataByDate$: Observable<any>;
  private _dataByDays$: Observable<any>;
  public vm$: Observable<any>;



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
  }

  private _loadPreferedDataBasedOnPageType(pageType: string): Observable<Subscriber | Subscribe | Post> {
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
