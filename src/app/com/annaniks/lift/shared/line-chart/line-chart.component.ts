import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, AfterViewInit {

  @Input()
  data: Date[]
  @Input()
  size: { width: string, height: string } = { width: '100%', height: '111px' }
  @Input()
  customId: string
  @Input()
  big: boolean = false;
  constructor() { }

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
        labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "MAY", "JUN", "JUL"],

        datasets: [{
          data: [5, 12, 10, 5, 15, 10, 20, 30, 40, 50],
          label: "Data",
          borderColor: "#3399cc",
          pointRadius: 0,
          fill: true,
          backgroundColor: "#3399cc8f",
          borderWidth: 4,
          lineTension: this.big ? 0 : null
        }]
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
              return `14:30 | +${tooltipItem.value}`
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
