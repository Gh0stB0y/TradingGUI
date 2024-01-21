import { AfterViewInit, Component,ElementRef,OnInit,ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexStroke,
} from "ng-apexcharts";

import { seriesData, seriesDataLinear } from "./ohlc";
import { from } from 'rxjs';
import * as ApexCharts from 'apexcharts';
import { ChartRecord } from 'src/app/MainPanel/main-panel/chartData';
import { SignalRService } from 'src/app/Services/signalr.service';
import { ChartDataService } from 'src/app/Services/chart-data.service';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;e
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
};
@Component({
  selector: 'app-manage-charts',
  templateUrl: './manage-charts.component.html',
  styleUrls: ['./manage-charts.component.scss',
                "../../../../css/main.min.css"]
})
export class ManageChartsComponent implements AfterViewInit{
  @ViewChild("chart") chart: ElementRef;
  options = {      
    chart: {
      height:'100%',
      width:'100%',
      title:'chuj',
      type: 'candlestick',
      foreColor: '#FFFFFF',    
      offsetX:0,
      offsetY:0,
      animations:{
        enabled:true,
        easing:'linear',
        speed:500
      }
    },
    tooltip:{
      enabled:true,
      theme:'dark',        
    },
    series: [
      {
        name: 'candles',    
        data:[
          // [1705745700000,[6593.34, 6600, 6582.63, 6600]],
          // [1705746000000,[6593.34, 6600, 6582.63, 6600]],
          // [1705746300000,[6293.34, 6800, 6582.63, 6600]],
          // [1705746600000,[6593.34, 6600, 6582.63, 6600]],
          // [1705746900000,[6593.34, 6600, 6582.63, 6600]],
          // [1705747200000,[6593.34, 6600, 6582.63, 6600]],
          // [1705747500000,[6593.34, 6600, 6582.63, 6500]],
          // [1705747800000,[6593.34, 6600, 6582.63, 6600]],
        ],        
      },        
    ],
    xaxis: {
      type:'datetime'
    }
  };

  constructor(private signalRService:SignalRService, private chartDataService:ChartDataService){}
  ngAfterViewInit(): void {
    this.initChart();
    this.ChartRecordListener();
  }

  AddCandles(data:ChartRecord){
    const chart = ApexCharts.exec('chart', 'getChart');
    console.log("chju");
    if (chart) {
      chart.updateSeries([{
        name: 'candles',
        data: [data.data],
      }]);
      chart.render();
      
    }

  }


  initChart() {
    // this.options = {      
    //   chart: {
    //     height:'100%',
    //     width:'100%',
    //     title:'chuj',
    //     type: 'candlestick',
    //     foreColor: '#FFFFFF',    
    //     offsetX:0,
    //     offsetY:0,
    //     animations:{
    //       enabled:true,
    //       easing:'linear',
    //       speed:500
    //     }
    //   },
    //   tooltip:{
    //     enabled:true,
    //     theme:'dark',        
    //   },
    //   series: [
    //     {
    //       name: 'candles',    
    //       data:[
    //         // [1705745700000,[6593.34, 6600, 6582.63, 6600]],
    //         // [1705746000000,[6593.34, 6600, 6582.63, 6600]],
    //         // [1705746300000,[6293.34, 6800, 6582.63, 6600]],
    //         // [1705746600000,[6593.34, 6600, 6582.63, 6600]],
    //         // [1705746900000,[6593.34, 6600, 6582.63, 6600]],
    //         // [1705747200000,[6593.34, 6600, 6582.63, 6600]],
    //         // [1705747500000,[6593.34, 6600, 6582.63, 6500]],
    //         // [1705747800000,[6593.34, 6600, 6582.63, 6600]],
    //       ],        
    //     },        
    //   ],
    //   xaxis: {
    //     type:'datetime'
    //   },
      
    // };
    const chart = new ApexCharts(this.chart.nativeElement, this.options);
    chart.render();
  }
  ChartRecordListener() {
    this.signalRService.ChartRecordListener().subscribe((chartRec)=>{
      let newRec:ChartRecord = 
      {
        name:chartRec.name,
        interval:chartRec.interval,
        data:
        [
          [chartRec.time,chartRec.data]
        ]
      }
      this.AddCandles(newRec);
    });
  }
}
