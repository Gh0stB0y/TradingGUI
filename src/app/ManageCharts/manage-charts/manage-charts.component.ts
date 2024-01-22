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
import { SubscribtionTablesItem } from 'src/Models/SubscribeInstruments/SubscribtionTablesItem';


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
 
  options:any = {      
    chart: {
      height:'100%',
      width:'100%',
      title:'MyChart',
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
                [1705939800000,[1.3188,1.3207,1.3183,1.3206]],
                [1705939860000,[1.3201,1.3201,1.3163,1.3173]],
                [1705939920000,[1.33188,1.3407,1.3183,1.3306]],
                [1705939980000,[1.3101,1.3101,1.3063,1.3073]],                   
              ]    
      },        
    ],
    xaxis: {
      type:'datetime'
    },
  };
  displayChart:ApexCharts;
  currentInstrument:string;
  currentInterval:string;
  InstrumentInfo:string[]=["","","",""];


  intervals:string[]=["M1","M5","M15","M30","H1","H4","D1","W1","MN1"];
  subscribedInstruments:SubscribtionTablesItem[]=[];

  constructor(private signalRService:SignalRService, private chartDataService:ChartDataService){}
  ngAfterViewInit(): void {
    this.initChart();
    this.ChartRecordListener();
  }
  AddCandles(data:ChartRecord){
    if(data.name === this.currentInstrument && data.interval === this.currentInterval)
    {
      this.displayChart.appendData
      ([{
        name: 'candles',
        data: data.data,
      }]);  
    }        
  }
  initChart() {
    this.displayChart = new ApexCharts(this.chart.nativeElement, this.options);
    this.displayChart.render();
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
  GetSubscribedInstruments(){
    this.subscribedInstruments = this.chartDataService.GetSubscribedElements();
  }
  PrintChart(){
    const chartRecord = this.chartDataService.GetChartData(this.currentInstrument,this.currentInterval);
    if(chartRecord === undefined)
    {
      console.error("Chart record undefined");
    }
    else
    {
      this.displayChart.updateSeries([{
        name:'candles',
        data:[]
      }]);
      this.displayChart.appendData([{
        name:'candles',
        data:chartRecord.data
      }]);
    }

  }
  PrintInstrumentProperties(){
    const instrument = this.subscribedInstruments.find(e=>e.name === this.currentInstrument)
    this.InstrumentInfo=[instrument.name,this.currentInterval,instrument.category,"Leverage: " + instrument.leverage];
  }
}
