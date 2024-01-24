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
import { LoginResponseDTO } from 'src/Models/LoginResponseDTO';


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
    Instrument:'1',
    Interval:'1',
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

  checkmarks:boolean[]=[false,false,false];
  UpdateInstrumentEnabledOption:number=1;
  intervals:string[]=["M1","M5","M15","M30","H1","H4","D1","W1","MN1"];
  subscribedInstruments:SubscribtionTablesItem[]=[];

  constructor(private signalRService:SignalRService, private chartDataService:ChartDataService){}
  ngAfterViewInit(): void {
    this.initChart();
    this.ChartRecordListener();
    this.ChartUpdateListener();
    this.GetSubscribedInstruments(); 
    this.UpdateIntrumentListener();
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
  DeleteChartData(){
    this.chartDataService.DeleteChartData();
    this.PrintChart();
  }
  UpdateIntrumentListener(){
    this.signalRService.UpdateChartListener().subscribe((DTO)=>{
      console.log(DTO);
      let chartRec:ChartRecord = {
        name:DTO.name,
        interval:DTO.interval,
        data:[]
      }
      for(let i = 0 ; i<DTO.data.length;i++)
      {
        chartRec.data.push([DTO.data[i].time,DTO.data[i].data]);
      }
      console.log(chartRec);
      this.chartDataService.AddChartRecords([chartRec]);
      this.AddCandles(chartRec);
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

  UpdateCheckmark(index:number){
    for(let i=0;i<this.checkmarks.length;i++){
      this.checkmarks[i]=false;
    }
    this.checkmarks[index]=true;
    
  }
  LoadUnsubscribedChart(){

  }
  UpdateIntrumentData(){      
    switch(this.UpdateInstrumentEnabledOption)
    {
      case 1:        
        break;
      case 2:
        this.UpdateInstrumentForm.candlesNumber=0;
      break;
      case 3:
        this.UpdateInstrumentForm.SearchNumber=0;
        this.UpdateInstrumentForm.SearchInterval='';
      break;
      default:
        console.log("empty record");
      break;
    }

    let token = localStorage.getItem("token");
    
    if(token)
    {
      this.signalRService.UpdateIntrumentData(this.UpdateInstrumentForm,token);
    }
  }
}
