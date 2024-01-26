import { Injectable } from '@angular/core';
import { ChartRecord } from '../MainPanel/main-panel/chartData';
import { SubscribtionTablesItem } from 'src/Models/SubscribeInstruments/SubscribtionTablesItem';
import { SubscribedItemDTO } from 'src/Models/SubscribeInstruments/SubscribedItemSimple';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  
  private chartData: ChartRecord[] = [];
  private subscribedElements:SubscribtionTablesItem[]=[];
  
  private currentInstrumentSubject = new Subject<string>();
  private currentIntervalSubject = new Subject<string>();
  private unsubscribedCategoriesSubject = new Subject<string[]>();

  private unsubscribedCategories:string[]=[];

  private currentInstrument:string = "";
  private currentInterval:string = "";


  DownloadDataFromStorage():void{
    const storedChartData = localStorage.getItem('chartData');
    if (storedChartData) {
      try {
        this.chartData = JSON.parse(storedChartData);
      } catch (error) {
        console.error('Error parsing stored chart data:', error);
      }
    }
  }
  SaveDataToStorage():void{
    localStorage.setItem('chartData', JSON.stringify(this.chartData));
  }
  ClearCharData():void{
    localStorage.removeItem('chartData');
  }
  DeleteChartData() {
    let index = this.chartData.findIndex(e=>e.name === this.currentInstrument && e.interval === this.currentInterval);
    if(index === -1){
      console.error("Chart records not found");
    }
    else{
      this.chartData[index].data=[];
      this.SaveDataToStorage();
    }
  }    
//////////////////////////////////////
  GetAllChartData(): ChartRecord[] {    
    return this.chartData;
  }
  GetChartData():ChartRecord{    
    let chart = this.chartData.find(e=>e.name === this.currentInstrument && e.interval === this.currentInterval);    
    return chart;    
  }
  AddChartRecords(rec:ChartRecord[]){
    for(let i=0;i<rec.length;i++)
    {
      let index = this.chartData.findIndex(e=>e.name === rec[i].name&&e.interval ===rec[i].interval);

      if(index === -1)
      {
        this.chartData.push(rec[i]);
      }
      else
      {
        for(let j=0;j<rec[i].data.length;j++)
        {
          let existingCandle = this.chartData[index].data.findIndex(e=>e[0] === rec[i].data[j][0])
          if(existingCandle === -1){
            this.chartData[index].data.push(rec[i].data[j]);
          }          
        }
      }    
    }    
    // console.log(this.chartData);
  }
  ClearChartRecord(rec:ChartRecord):void
  {
    let index = this.chartData.findIndex(e=>e.name === rec.name && e.interval === rec.interval);

    if(index === -1)
    {
      console.log("Name not found");
    }
    else
    {
      this.chartData.splice(index,1);
    }
  }

  AddSubscribedElements(item:SubscribtionTablesItem):void{
    this.subscribedElements.push(item);
  }
  DeleteSubscribedElements(name:string):void{
    let index=this.subscribedElements.findIndex(e=>e.name ===name);
    this.subscribedElements.splice(index,1);
  }
  UpdateElements(subed:SubscribtionTablesItem[]):void{
    let subscribedItems = subed.filter(item => item.name.trim() !== '');
    this.subscribedElements=subscribedItems;
  }  
  GetSubscribedElements():SubscribtionTablesItem[]{
    return this.subscribedElements;
  }
  UpdateCurrentInstrument(value: string): void {
    this.currentInstrument = value;
    this.currentInstrumentSubject.next(value);
  }
  UpdateCurrentInterval(value: string): void {
    this.currentInterval = value;
    this.currentIntervalSubject.next(value);
  }
  UpdateUnsubscribedCategories(data:string[]){
    this.unsubscribedCategories=data;
    this.unsubscribedCategoriesSubject.next(data);
  }
  GetCurrentInstrument():string{    
    return this.currentInstrument;
  }
  GetCurrentInterval():string{
    return this.currentInterval;
  }
  GetInstrumentObservable():Observable<string>{
    return this.currentInstrumentSubject.asObservable();
  }
  GetIntervalObservable():Observable<string>{
    return this.currentIntervalSubject.asObservable();
  }
  GetCategoriesObservable():Observable<string[]>{
    return this.unsubscribedCategoriesSubject.asObservable();
  }
}
