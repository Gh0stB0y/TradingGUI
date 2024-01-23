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
import { UpdateDataForm } from 'src/Models/ManageCharts/UpdateDataForm';
import { LoadUnsubscribedForm } from 'src/Models/ManageCharts/LoadUnsubscribedForm';


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
        data:[]    
      },        
    ],
    xaxis: {
      type:'datetime'
    },
    yaxis:{
      
    }
  };
  displayChart:ApexCharts;
  InstrumentInfo:string[]=["","","",""];

  UpdateInstrumentForm:UpdateDataForm = {
    Instrument:'',
    Interval:'',
    Alldata:false,
    SearchInterval:'',
    SearchNumber:0,
    candlesNumber:0    
  }
  LoadUnsubscribedForm:LoadUnsubscribedForm = {
    Category:'',
    Instrument:'',
    Interval:'',
  }

  UpdateInstrumentEnabledOption:number=1;
  intervals:string[]=["M1","M5","M15","M30","H1","H4","D1","W1","MN1"];
  subscribedInstruments:SubscribtionTablesItem[]=[];

  constructor(private signalRService:SignalRService, private chartDataService:ChartDataService){}
  ngAfterViewInit(): void {
    this.initChart();
    this.ChartRecordListener();
    this.ChartUpdateListener();
    this.GetSubscribedInstruments(); 
  }
  AddCandles(data:ChartRecord){
    if(data.name === this.chartDataService.getCurrentInstrument() && data.interval === this.chartDataService.getCurrentInterval())
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
  ChartUpdateListener(){
    this.chartDataService.getInstrumentObservable().subscribe(()=>{
      this.PrintInstrumentProperties();
      this.PrintChart();
    });
    this.chartDataService.getIntervalObservable().subscribe(()=>{
      this.PrintInstrumentProperties();
      this.PrintChart();    
    });    
  }
  GetSubscribedInstruments(){
    this.subscribedInstruments = this.chartDataService.GetSubscribedElements();
  }
  PrintChart(){
    const chartRecord = this.chartDataService.GetChartData();
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
    const instrument = this.subscribedInstruments.find(e=>e.name === this.chartDataService.getCurrentInstrument())
    this.InstrumentInfo=[instrument.name,this.chartDataService.getCurrentInterval(),instrument.category,"Leverage: " + instrument.leverage];
  }
  SetCurrentInterval(interval:string){
    this.chartDataService.updateCurrentInterval(interval);
  }
  SetCurrentInstrument(instrument:string){
    this.chartDataService.updateCurrentInstrument(instrument);
  }

  LoadUnsubscribedChart(){

  }
  UpdateIntrumentData(){
    console.log(this.UpdateInstrumentForm.Instrument);
  }
}
