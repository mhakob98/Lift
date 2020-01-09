import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SubscribesPostsService } from './subscribes-posts.service';

import { catchError, map, filter } from 'rxjs/operators';
import { of, combineLatest, Observable } from 'rxjs';
import { Subscriber } from '../../../../core/models/subscriber';
import { ActivatedRoute } from '@angular/router';
import { Subscribe } from '../../../../core/models/subscribe';
import { StatisticPost } from '../../../../core/models/statistic-post';

import { EChartOption } from 'echarts';


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
  pieChartOption: EChartOption = {
    title: {
      text: '同名数量统计',
      subtext: '纯属虚构',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: this.genData(10).legendData,

      selected: this.genData(10).selected
    },
    series: [
      {
        name: '姓名',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: this.genData(10).seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
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
  }

  genData(count) {
    var nameList = [
      '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
    ];
    var legendData = [];
    var seriesData = [];
    var selected = {};
    for (var i = 0; i < count; i++) {
      let name = Math.random() > 0.65
        ? makeWord(4, 1) + '·' + makeWord(3, 0)
        : makeWord(2, 1);
      legendData.push(name);
      seriesData.push({
        name: name,
        value: Math.round(Math.random() * 100000)
      });
      selected[name] = i < 6;
    }

    return {
      legendData: legendData,
      seriesData: seriesData,
      selected: selected
    };

    function makeWord(max, min) {
      var nameLen = Math.ceil(Math.random() * max + min);
      var name = [];
      for (var i = 0; i < nameLen; i++) {
        name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
      }
      return name.join('');
    }
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
