import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { LineChartData } from '../../../core/models/statistics';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, AfterViewInit {
  private _dataSets = [];

  @Input()
  size: { width: string, height: string } = { width: '100%', height: '111px' }
  @Input()
  customId: string
  @Input()
  big: boolean = false;
  @Input()
  labels: string[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "MAY", "JUN", "JUL"];
  @Input()
  set dataSets($event) {
    const dataSets: LineChartData[] = $event;
    this._dataSets = [];
    dataSets.map((element) => {
      this._dataSets.push({
        data: element.data,
        label: element.label,
        borderColor: element.borderColor,
        pointRadius: 0,
        fill: true,
        backgroundColor: element.backgroundColor,
        borderWidth: 4,
        lineTension: this.big ? 0 : null
      })
    })
  }

  constructor() {
    this._dataSets = [];
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._initLineChart()
  }

  private _initLineChart(): void {
    var ctx = document.getElementById(this.customId);
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this._dataSets
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        tooltips: {
          intersect: false,
          mode: 'index',
          displayColors: false,
          backgroundColor: 'white',
          bodyFontFamily: 'SF UI Display Regular',
          bodyFontColor: '#ababab',
          callbacks: {
            title: () => {
              return ''
            },
            label: (tooltipItem) => {
              return (this.big) ? `+${tooltipItem.value} ${this._dataSets[tooltipItem.datasetIndex].label}` : `+${tooltipItem.value} | ${tooltipItem.xLabel}`
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              display: this.big ? true : false
            },
            gridLines: {
              drawTicks: this.big ? true : false,
              display: true
            }
          }],
          xAxes: [{
            gridLines: {
              drawTicks: this.big ? true : false,
              display: this.big ? true : false
            },
            ticks: {
              display: this.big ? true : false,
            }
          }]
        }
      }
    });
  }
}
