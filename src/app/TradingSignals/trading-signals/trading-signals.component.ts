import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InitializeProcessorDTO } from 'src/Models/InitializeProcessorDTO';
import { SubscribtionTablesItem } from 'src/Models/SubscribeInstruments/SubscribtionTablesItem';
import { ChartDataService } from 'src/app/Services/chart-data.service';
import { SignalRService } from 'src/app/Services/signalr.service';
import { describtions } from '../describtions';
import { MessageBoxService } from 'src/app/Services/message-box.service';
import { MyMessageDTO } from 'src/Models/MyMessageDTO';
import { ProcessedInstrumentDTO } from 'src/Models/ProcessedInstrumentDTO';
import { UpdateProcessedInstrumentDTO } from 'src/Models/UpdateProcessedInstrumentDTO';

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
  selector: 'app-trading-signals',
  templateUrl: './trading-signals.component.html',
  styleUrls: ['./trading-signals.component.scss',
                "../../../../css/main.min.css"]
})
export class TradingSignalsComponent implements AfterViewInit{
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

  actionDescribtion:string[]=[];
  checked:number=0;
  currentUpdateInstrument:string='1';
  currentViewInstrument:string='1';
  form:InitializeProcessorDTO = new InitializeProcessorDTO();
  isProcessorActive:boolean = false;
  processorActive:boolean = false;
  processedInstruments:ProcessedInstrumentDTO;
  processorInstrumentValues:ProcessedInstrumentDTO[]=[];
  processorInitialized:boolean=false;
  processorStatus:string = "Not active";
  subscribedInstruments:SubscribtionTablesItem[]=[];
  UpdateInstrumentValues:UpdateProcessedInstrumentDTO={
    name:'',
    checkingDuration:0,
    riskAssessment:0,
    minPipsIncome:0,
    desiredPipsIncome:0,
    stopLossPips:0
  };
  ViewInstrumentValues:ProcessedInstrumentDTO={
    name:'',
    category:'',
    leverage:0,
    currentSpread:0,
    checkingDuration:0,
    riskAssessment:0,
    minPipsIncome:0,
    desiredPipsIncome:0,
    stopLossPips:0
  };
  waitingForResponse:boolean=true;

  constructor(private signalRService:SignalRService, private chartDataService:ChartDataService, private messageBoxService:MessageBoxService){
    this.GetSubscribedInstruments();    
    this.ActiveProcessorListener();
  }

  async ngAfterViewInit(): Promise<void> 
  {
    let token = localStorage.getItem("token");
      if(token)
      {
        this.processorInitialized = await this.signalRService.IsProcessorInitialized(token);
      }
    this.waitingForResponse = false;
    this.actionDescribtion = describtions;
    if(this.processorInitialized === true)
    {
      await this.GetProcessorValues();
      this.InitChart(); 
    }    
  }
  
  private InitChart() {
    this.displayChart = new ApexCharts(this.chart.nativeElement, this.options);
    this.displayChart.render();
  }

  ActivateProcessor() {
    let token = localStorage.getItem("token");
    if(token)
    {
      this.signalRService.ActivateProcessor(token);
    }    
  }
  CheckboxChanged(instrument:string){

    let index=this.form.Instruments.findIndex(e=>e === instrument)
    if(index === -1){
      this.form.Instruments.push(instrument);
    }
    else{
      this.form.Instruments.splice(index,1);
    }

    console.log(this.form.Instruments);
  }
  CheckFormValues():boolean{

    if(this.form.Instruments.length===0)
    {
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Empty list of instruments"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;
    }

    if(this.form.option === 0)
    {
      if(this.form.longTrendMaxHours === 0 || this.form.longTrendMinHours === 0 || this.form.midTrendMaxHours === 0 
        || this.form.midTrendMinHours === 0 || this.form.shortTrendMaxHours === 0)
        {
          let msg:MyMessageDTO={
            msgType:"Error",
            msgVal:"Processing scope days - Except short trend min, values cannot be 0"
          }
          this.messageBoxService.SendInternalMessage(msg);
          return false;
        }
      if(this.form.longTrendMaxHours<=this.form.longTrendMinHours)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope days, long days - max value is lower than min value"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }
      if(this.form.midTrendMaxHours<=this.form.midTrendMinHours)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope days, mid days - max value is lower than min value"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }
      if(this.form.longTrendMaxHours<=this.form.shortTrendMinHours)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope days, short days - max value is lower than min value"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }

      if(this.form.longTrendMaxHours<=this.form.shortTrendMaxHours ||  this.form.longTrendMaxHours<=this.form.midTrendMaxHours)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope days, long trend - Max value is too small"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }
      if(this.form.longTrendMinHours<=this.form.shortTrendMinHours ||  this.form.longTrendMinHours<=this.form.midTrendMinHours)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope days, long trend - Min value is too small"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }

      if(this.form.midTrendMinHours<=this.form.shortTrendMinHours)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope days, mid trend - Min value is too small"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }
      if(this.form.midTrendMaxHours<=this.form.shortTrendMaxHours)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope days, mid trend - Max value is too small"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }
    }
    else if(this.form.option === 1)
    {
      if(this.form.longTrendMaxCandles === 0 || this.form.longTrendMinCandles === 0 || this.form.midTrendMaxCandles === 0 
        || this.form.midTrendMinCandles === 0 || this.form.shortTrendMaxCandles === 0)
        {
          let msg:MyMessageDTO={
            msgType:"Error",
            msgVal:"Processing scope candles - Except short trend min, values cannot be 0"
          }
          this.messageBoxService.SendInternalMessage(msg);
          return false;
        }
      if(this.form.longTrendMaxCandles<=this.form.longTrendMinCandles)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope candles, long candles - max value is lower than min value"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }
      if(this.form.midTrendMaxCandles<=this.form.midTrendMinCandles)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope candles, mid candles - max value is lower than min value"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }
      if(this.form.longTrendMaxCandles<=this.form.shortTrendMinCandles)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope candles, short candles - max value is lower than min value"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }

      if(this.form.longTrendMaxCandles<=this.form.shortTrendMaxCandles ||  this.form.longTrendMaxCandles<=this.form.midTrendMaxCandles)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope candles, long trend - Max value is too small"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }
      if(this.form.longTrendMinCandles<=this.form.shortTrendMinCandles ||  this.form.longTrendMinCandles<=this.form.midTrendMinCandles)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope candles, long trend - Min value is too small"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }

      if(this.form.midTrendMinCandles<=this.form.shortTrendMinCandles)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope candles, mid trend - Min value is too small"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }
      if(this.form.midTrendMaxCandles<=this.form.shortTrendMaxCandles)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:"Processing scope candles, mid trend - Max value is too small"
        }
        this.messageBoxService.SendInternalMessage(msg);
        return false;
      }
    }
    else
    {
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Wrong option value"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;
    }

    if(this.form.checkingDuration<1)
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Checking duration value too small"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }
    if(this.form.riskAssessment<1 || this.form.riskAssessment>5 )
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Wrong risk assessments value. Should be 1-5"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }
    if(this.form.minPipsIncome<1)
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Minimum pips income value is too small"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }
    if(this.form.desiredPipsIncome<1)
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Desired pips income value is too small"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }
    if(this.form.stopLossPips<1)
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Stop loss pips income value is too small"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }
    if(this.form.desiredPipsIncome<this.form.minPipsIncome)
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Desired pips income value cannot be smaller than minimum pips income"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }

    let msg:MyMessageDTO={
      msgType:"Info",
      msgVal:"Form correct"
    }
    this.messageBoxService.SendInternalMessage(msg);
    return true;
  }
  CheckUpdateValues():boolean{

    if(this.UpdateInstrumentValues.checkingDuration<1)
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Checking duration value too small"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }
    if(this.UpdateInstrumentValues.riskAssessment<1 || this.UpdateInstrumentValues.riskAssessment>5 )
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Wrong risk assessments value. Should be 1-5"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }
    if(this.UpdateInstrumentValues.minPipsIncome<1)
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Minimum pips income value is too small"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }
    if(this.UpdateInstrumentValues.desiredPipsIncome<1)
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Desired pips income value is too small"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }
    if(this.UpdateInstrumentValues.stopLossPips<1)
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Stop loss pips income value is too small"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }
    if(this.UpdateInstrumentValues.desiredPipsIncome<this.UpdateInstrumentValues.minPipsIncome)
    {      
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Desired pips income value cannot be smaller than minimum pips income"
      }
      this.messageBoxService.SendInternalMessage(msg);
      return false;      
    }
    let msg:MyMessageDTO={
      msgType:"Info",
      msgVal:"Form correct"
    }
    this.messageBoxService.SendInternalMessage(msg);
    return true;
  }
  ChooseOption(option: number) {
    this.form.option=option;
    this.checked=option;
    if(this.form.option === 1){
      this.form.longTrendMaxCandles=0;
      this.form.longTrendMinCandles=0;
      this.form.midTrendMaxCandles=0;
      this.form.midTrendMinCandles=0;
      this.form.shortTrendMaxCandles=0;
      this.form.shortTrendMinCandles=0;
    }
    if(this.form.option === 2){
      this.form.longTrendMaxHours=0;
      this.form.longTrendMinHours=0;
      this.form.midTrendMaxHours=0;
      this.form.midTrendMinHours=0;
      this.form.shortTrendMaxHours=0;
      this.form.shortTrendMinHours=0;
    }
  }
  DeactivateProcessor() {
    let token = localStorage.getItem("token");
    if(token)
    {
      this.signalRService.DeactivateProcessor(token);
    } 
  }
  async GetProcessorValues() {
    let token = localStorage.getItem("token");
    if(token)
    {
      try
      {
        this.processorInstrumentValues = await this.signalRService.GetProcessorValues(token);
      }
      catch(error)
      {
        let msg:MyMessageDTO={
          msgType:"Error",
          msgVal:error
        };
        this.messageBoxService.SendInternalMessage(msg);
      }
    }    
  }
  GetSubscribedInstruments(){
    this.subscribedInstruments = this.chartDataService.GetSubscribedElements();           
  }
  async InitializeProcessor() {
    let formCorrect:boolean = this.CheckFormValues();
    if(formCorrect === true)
    {
      let token = localStorage.getItem("token");
      if(token)
      {
        try{
          this.processorInitialized = await this.signalRService.InitializeProcessor(this.form,token);
          await this.GetProcessorValues();    
          this.InitChart();      
        }
        catch{
          let msg:MyMessageDTO={
            msgType:"Error",
            msgVal:"Initialize processor: error while initializing"
          }
          this.messageBoxService.SendInternalMessage(msg);
        }        
      }    
    }
  }
  async KillProcessor(){
    let token = localStorage.getItem("token");
    if(token)
    {
      this.processorInitialized = !await this.signalRService.KillProcessor(token);
      this.form= new InitializeProcessorDTO();
      this.processorStatus="Not active";
      this.processorActive = false;
    } 
  }
  NewSubscribtionListener():void{
    this.signalRService.NewSubscribtionListener().subscribe((instrument)=>
    {
      let index = this.subscribedInstruments.findIndex(e=>e.name === instrument.name);
      if(index === -1){

        const obj:SubscribtionTablesItem ={
          name:instrument.name,
          category:instrument.category,
          ask:instrument.ask.toString(),
          bid:instrument.bid.toString(),
          leverage:instrument.leverage.toString(),
          waitingResponse:false
        } 
        this.subscribedInstruments.push(obj);
      }
    });
  }
  RemoveSubscribtionListener():void{
    this.signalRService.RemoveSubscribtionListener().subscribe((instrument)=>{
      let index = this.subscribedInstruments.findIndex(e=>e.name === instrument);
      if(index !== -1){
        this.subscribedInstruments.splice(index,1);
      }
    });
  }
  SetViewInstrument(){
    let index = this.processorInstrumentValues.findIndex(e=>e.name === this.currentViewInstrument);
    if(index !== -1)
    {
      this.ViewInstrumentValues.name=this.processorInstrumentValues[index].name;
      this.ViewInstrumentValues.category=this.processorInstrumentValues[index].category;
      this.ViewInstrumentValues.leverage=this.processorInstrumentValues[index].leverage;
      this.ViewInstrumentValues.currentSpread=this.processorInstrumentValues[index].currentSpread;
      this.ViewInstrumentValues.checkingDuration=this.processorInstrumentValues[index].checkingDuration;
      this.ViewInstrumentValues.riskAssessment=this.processorInstrumentValues[index].riskAssessment;
      this.ViewInstrumentValues.minPipsIncome=this.processorInstrumentValues[index].minPipsIncome;
      this.ViewInstrumentValues.desiredPipsIncome=this.processorInstrumentValues[index].desiredPipsIncome;
      this.ViewInstrumentValues.stopLossPips=this.processorInstrumentValues[index].stopLossPips;
    }
    else
    {
      this.ViewInstrumentValues.name='';
      this.ViewInstrumentValues.category='';
      this.ViewInstrumentValues.leverage=0;
      this.ViewInstrumentValues.currentSpread=0;
      this.ViewInstrumentValues.checkingDuration=0;
      this.ViewInstrumentValues.riskAssessment=0;
      this.ViewInstrumentValues.minPipsIncome=0;
      this.ViewInstrumentValues.desiredPipsIncome=0;
      this.ViewInstrumentValues.stopLossPips=0;
    }
  } 
  async UpdateInstrument(){    
    this.UpdateInstrumentValues.name = this.currentUpdateInstrument;

    this.CheckUpdateValues()


    if(this.UpdateInstrumentValues.name!=='1')
    {
      let token = localStorage.getItem("token");
      if(token)
      {
        try
        {
          let newObj = await this.signalRService.UpdateProcessedInstrument(token,this.UpdateInstrumentValues);

          console.log(newObj);
          let index = this.processorInstrumentValues.findIndex(e=>e.name === newObj.name);
          if(index !== -1){
            this.processorInstrumentValues[index]=newObj;
            if(this.currentViewInstrument === newObj.name)
            {
              this.ViewInstrumentValues.currentSpread = newObj.currentSpread;
              this.ViewInstrumentValues.checkingDuration = newObj.checkingDuration;
              this.ViewInstrumentValues.riskAssessment = newObj.riskAssessment;
              this.ViewInstrumentValues.minPipsIncome = newObj.minPipsIncome;
              this.ViewInstrumentValues.desiredPipsIncome = newObj.desiredPipsIncome;
              this.ViewInstrumentValues.stopLossPips = newObj.stopLossPips;

            }
          }
          else{
            let msg:MyMessageDTO={
              msgType:"Error",
              msgVal:"this.processorInstrumentValues: name not found"
            };
            this.messageBoxService.SendInternalMessage(msg);
          }
        }
        catch(error)
        {
          let msg:MyMessageDTO={
            msgType:"Error",
            msgVal:error
          };
          this.messageBoxService.SendInternalMessage(msg);
        }
      }
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




  /////////////////////////LISTENERS//////////////////
  ActiveProcessorListener():void{
    this.signalRService.ActiveProcessorListener().subscribe((data)=>{
      if(data === 'active')
      {
        this.isProcessorActive = true;
        this.processorStatus = "Active";
        this.processorActive = true;
      }
      if(data === 'noActive')
      {
        this.isProcessorActive = false;
        this.processorStatus = "Not active";
        this.processorActive = false;
      }
    });
  }
}
