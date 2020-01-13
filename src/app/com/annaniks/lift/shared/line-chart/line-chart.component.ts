import { Component, OnInit, Input } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @Input()
  data: Date[]

  lineChartOption: EChartOption = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      backgroundColor: '#ffffff',
      textStyle: {
        color: '#3d3d3d',
        fontSize: 14
      },
      extraCssText: 'box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);',
      trigger: 'axis',
      formatter: function (params: any) {
        params = params[0];
        return `${params.data} | 2020`
      },
      axisPointer: {
        animation: true
      }
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      showSymbol: false,
      // step: false,
      areaStyle: {
        color: 'rgba(160,176,188,0.2)',
      },
      lineStyle: {
        color: '#3399cc'
      },
      markPoint: {
        symbolSize: 900,
        itemStyle: {
          color: 'blue'
        }
      },
      // symbol: 'circle',
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.5,
          colorStops: [{
            offset: 0, color: 'white'
          }, {
            offset: 1, color: '#3399cc'
          }],
          global: false
        }
      }
    }]
  };

  constructor() { }

  ngOnInit() {
  }

}
