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
import { SubscribtionTablesDTO } from 'src/Models/SubscribeInstruments/SubscribtionTablesDTO';
import { UpdateChartDTO } from 'src/Models/ManageCharts/UpdateChartDTO';


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
 
  checkmarks:boolean[]=[false,false,false];
  displayChart:ApexCharts;
  InstrumentInfo:string[]=["","","",""];
  intervals:string[]=["M1","M5","M15","M30","H1","H4","D1","W1","MN1"];
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
  UpdateInstrumentForm:UpdateDataForm = {
    Instrument:'1',
    Interval:'1',
    Option:0,
    SearchInterval:'',
    SearchNumber:0,
    candlesNumber:0    
  }
  LoadUnsubscribedForm:LoadUnsubscribedForm = {
    Category:'1',
    Instrument:'1',
    Interval:'1',
    Option:0,
    SearchInterval:'',
    SearchNumber:0,
    candlesNumber:0 
  }
  subscribedInstruments:SubscribtionTablesItem[]=[];
  unlockUnsubscribedInstruments:boolean=false;
  unsubscribedCategories:string[]=[];
  unsubscribedInstruments:SubscribtionTablesItem[]=[];
  
  constructor(private signalRService:SignalRService, private chartDataService:ChartDataService){
    this.GetSubscribedInstruments(); 
  }
  ngAfterViewInit(): void {
    this.initChart();
    this.ChartRecordListener();
    this.ChartUpdateListener();    
    this.UnsubscribedCategoriesListener();
    this.UpdateIntrumentListener();
    this.PrintInstrumentProperties();
    this.PrintChart();
  }

  AddCandles(data:ChartRecord){
    if(data.name === this.chartDataService.GetCurrentInstrument() && data.interval === this.chartDataService.GetCurrentInterval())
    {
      this.displayChart.appendData
      ([{
        name: 'candles',
        data: data.data,
      }]);  
    }        
  }
  DeleteChartData(){
    this.chartDataService.DeleteChartData();
    this.PrintChart();
  }
  GetSubscribedInstruments(){
    this.subscribedInstruments = this.chartDataService.GetSubscribedElements();           
  }
  async GetUnsubscribedInstruments(event:Event){
    const selectedCategory = (event.target as HTMLSelectElement).value;

    if(selectedCategory==="1")
    {
      this.unlockUnsubscribedInstruments=false;  
    }
    else
    {
      const data=await this.signalRService.GetUnsubscribedInstrumentsByCat(selectedCategory);

      this.unsubscribedInstruments=[];
      for(let i = 0; i<data.length;i++)
      {
        const rec = data[i];
        this.unsubscribedInstruments.push({name:rec.name,category:rec.category,ask:rec.ask.toString(),bid:rec.bid.toString(),leverage:rec.leverage.toString(),waitingResponse:false});
      }

       

      this.unlockUnsubscribedInstruments=true;
    }    
  }
  initChart() {
    this.displayChart = new ApexCharts(this.chart.nativeElement, this.options);
    this.displayChart.render();
  }
  async LoadUnsubscribedChart(){
    
    if(this.LoadUnsubscribedForm.Instrument !== '1' && this.LoadUnsubscribedForm.Category !== '1'
        && this.LoadUnsubscribedForm.Interval !== '1' && this.LoadUnsubscribedForm.Option !== 0)
    {
      let data:UpdateChartDTO;
      switch(this.LoadUnsubscribedForm.Option)
      {
        case 1:        
          this.LoadUnsubscribedForm.candlesNumber=0;
          if(this.LoadUnsubscribedForm.SearchNumber!==0 && this.LoadUnsubscribedForm.SearchInterval!=='')
          {
            let token = localStorage.getItem("token");
            if(token)
            {
              
              let DTO:UpdateDataForm = {
                Instrument:this.LoadUnsubscribedForm.Instrument,
                Interval:this.LoadUnsubscribedForm.Interval,
                Option: this.LoadUnsubscribedForm.Option,
                SearchInterval:this.LoadUnsubscribedForm.SearchInterval,
                SearchNumber:this.LoadUnsubscribedForm.SearchNumber,
                candlesNumber:this.LoadUnsubscribedForm.candlesNumber
              } ;
              data = await this.signalRService.LoadUnsubscribedInstrument(DTO,token);              
            }
          }
        break;
        case 2:
          this.LoadUnsubscribedForm.SearchNumber=0;
          this.LoadUnsubscribedForm.SearchInterval='';

          if(this.LoadUnsubscribedForm.candlesNumber!== 0)
          {
            let token = localStorage.getItem("token");
            if(token)
            {
              let DTO:UpdateDataForm = {
                Instrument:this.LoadUnsubscribedForm.Instrument,
                Interval:this.LoadUnsubscribedForm.Interval,
                Option: this.LoadUnsubscribedForm.Option,
                SearchInterval:this.LoadUnsubscribedForm.SearchInterval,
                SearchNumber:this.LoadUnsubscribedForm.SearchNumber,
                candlesNumber:this.LoadUnsubscribedForm.candlesNumber
              } ;
              data = await this.signalRService.LoadUnsubscribedInstrument(DTO,token);
            }
          }
        break;        
      }
      let chartRec:ChartRecord = {
        name:data.name,
        interval:data.interval,
        data:[]
      }
      for(let i = 0 ; i<data.data.length;i++)
      {
        chartRec.data.push([data.data[i].time,data.data[i].data]);
      }
      this.chartDataService.AddChartRecords([chartRec]);
      this.AddCandles(chartRec);
      this.chartDataService.UpdateCurrentInstrument(data.name);
      this.chartDataService.UpdateCurrentInterval(data.interval);
    }

  }
  PrintChart(){
    const chartRecord = this.chartDataService.GetChartData();
    this.displayChart.updateSeries([{
      name:'candles',
      data:[]
    }]);
    if(chartRecord !== undefined)
    {
      this.displayChart.appendData([{
        name:'candles',
        data:chartRecord.data
      }]);
    }
  }
  PrintInstrumentProperties(){
    
    let instrument = this.subscribedInstruments.find(e=>e.name === this.chartDataService.GetCurrentInstrument());
    if(instrument===undefined){

      instrument = this.unsubscribedInstruments.find(e=>e.name=== this.chartDataService.GetCurrentInstrument());
      this.InstrumentInfo=[instrument.name,this.chartDataService.GetCurrentInterval(),instrument.category,"Leverage: " + instrument.leverage]; 
    }
    else{
      this.InstrumentInfo=[instrument.name,this.chartDataService.GetCurrentInterval(),instrument.category,"Leverage: " + instrument.leverage]; 
    }
      
  }  
  SetCurrentInterval(interval:string){
    this.chartDataService.UpdateCurrentInterval(interval);
  }
  SetCurrentInstrument(instrument:string){
    this.chartDataService.UpdateCurrentInstrument(instrument);
  }
  UpdateCheckmark(index:number){
    for(let i=0;i<this.checkmarks.length;i++){
      this.checkmarks[i]=false;
    }
    this.checkmarks[index]=true;
    
  }
  UpdateIntrumentData(){      

    if(this.UpdateInstrumentForm.Instrument !=='1' && this.UpdateInstrumentForm.Interval !=='1')
    {
      console.log(this.UpdateInstrumentForm);
      switch(this.UpdateInstrumentForm.Option)
      {
        case 1:        
          break;
        case 2:
          this.UpdateInstrumentForm.candlesNumber=0;
          if(this.UpdateInstrumentForm.SearchNumber!==0 && this.UpdateInstrumentForm.SearchInterval!=='')
          {
            let token = localStorage.getItem("token");
            if(token)
            {
              this.signalRService.UpdateIntrumentData(this.UpdateInstrumentForm,token);
            }
          }
        break;
        case 3:
          this.UpdateInstrumentForm.SearchNumber=0;
          this.UpdateInstrumentForm.SearchInterval='';
          if(this.UpdateInstrumentForm.candlesNumber!==0)
          {
            let token = localStorage.getItem("token");
            if(token)
            {
              this.signalRService.UpdateIntrumentData(this.UpdateInstrumentForm,token);
            }
          }
        break;
        default:
          console.log("empty record");
        break;
      }
  
      
    }
  }   
  
  ///////////////LISTENERS//////////////////
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
    this.chartDataService.GetInstrumentObservable().subscribe(()=>{
      this.PrintInstrumentProperties();
      this.PrintChart();
    });
    this.chartDataService.GetIntervalObservable().subscribe(()=>{
      this.PrintInstrumentProperties();
      this.PrintChart();    
    });    
  }
  UnsubscribedCategoriesListener(){
    this.chartDataService.GetCategoriesObservable().subscribe((data:string[])=>{
      this.unsubscribedCategories = data;
    });
  }
  UpdateIntrumentListener(){
    this.signalRService.UpdateChartListener().subscribe((DTO)=>{
      let chartRec:ChartRecord = {
        name:DTO.name,
        interval:DTO.interval,
        data:[]
      }
      for(let i = 0 ; i<DTO.data.length;i++)
      {
        chartRec.data.push([DTO.data[i].time,DTO.data[i].data]);
      }
      this.chartDataService.AddChartRecords([chartRec]);
      this.AddCandles(chartRec);
    });
  }
}
