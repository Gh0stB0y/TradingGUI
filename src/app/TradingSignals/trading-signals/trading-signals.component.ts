import { AfterViewInit, Component, OnInit } from '@angular/core';
import { InitializeProcessorDTO } from 'src/Models/InitializeProcessorDTO';
import { SubscribtionTablesItem } from 'src/Models/SubscribeInstruments/SubscribtionTablesItem';
import { ChartDataService } from 'src/app/Services/chart-data.service';
import { SignalRService } from 'src/app/Services/signalr.service';
import { describtions } from '../describtions';
import { MessageBoxService } from 'src/app/Services/message-box.service';
import { MyMessageDTO } from 'src/Models/MyMessageDTO';
@Component({
  selector: 'app-trading-signals',
  templateUrl: './trading-signals.component.html',
  styleUrls: ['./trading-signals.component.scss',
                "../../../../css/main.min.css"]
})
export class TradingSignalsComponent implements AfterViewInit{

  processorInitialized:boolean=false;
  waitingForResponse:boolean=true;
  checked:number=0;
  actionDescribtion:string[]=[];
  subscribedInstruments:SubscribtionTablesItem[]=[];

  form:InitializeProcessorDTO = new InitializeProcessorDTO();
  

  constructor(private signalRService:SignalRService, private chartDataService:ChartDataService, private messageBoxService:MessageBoxService){
    this.GetSubscribedInstruments();    
  }

  async ngAfterViewInit(): Promise<void> {
    this.processorInitialized = await this.signalRService.IsProcessorInitialized();
    this.waitingForResponse = false;
    this.actionDescribtion = describtions;
  }
  InitializeProcessor() {
    console.log(this.form);
    let formCorrect:boolean = this.CheckFormValues();
    if(formCorrect === true)
    {
      let token = localStorage.getItem("token");
      if(token)
      {
        this.signalRService.InitializeProcessor(this.form,token);
      }    
    }
    else
    {
      let msg:MyMessageDTO={
        msgType:"Error",
        msgVal:"Jebac disa"
      };
      this.messageBoxService.SendInternalMessage(msg);
    }


    
  }
  ChooseOption(option: number) {
    this.form.option=option;
    this.checked=option;
    if(this.form.option === 0){
      this.form.longTrendMaxCandles=0;
      this.form.longTrendMinCandles=0;
      this.form.midTrendMaxCandles=0;
      this.form.midTrendMinCandles=0;
      this.form.shortTrendMaxCandles=0;
      this.form.shortTrendMinCandles=0;
    }
    if(this.form.option === 1){
      this.form.longTrendMaxDays=0;
      this.form.longTrendMinDays=0;
      this.form.midTrendMaxDays=0;
      this.form.midTrendMinDays=0;
      this.form.shortTrendMaxDays=0;
      this.form.shortTrendMinDays=0;
    }
  }
  GetSubscribedInstruments(){
    this.subscribedInstruments = this.chartDataService.GetSubscribedElements();           
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
  CheckFormValues():boolean{





    return false;
  }
}
