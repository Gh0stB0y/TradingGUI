import { Injectable } from '@angular/core';
import { ChartRecord } from '../MainPanel/main-panel/chartData';
import { SubscribtionTablesItem } from 'src/Models/SubscribeInstruments/SubscribtionTablesItem';
import { SubscribedItemDTO } from 'src/Models/SubscribeInstruments/SubscribedItemSimple';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  private chartData: ChartRecord[] = [];
  private unsubscribedElements:SubscribtionTablesItem[]=[];
  private subscribedElements:SubscribtionTablesItem[]=[];

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
//////////////////////////////////////
  GetAllChartData(): ChartRecord[] {    
    return this.chartData;
  }
  GetChartData(name:string,interval:string):ChartRecord{

    let chart = this.chartData.find(e=>e.name === name && e.interval === interval);    
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
          else{
            console.error("candle with such date already in localstorage");
          }
        }
      }    
    }    
    console.log(this.chartData);
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
  UpdateElements(notSubed:SubscribtionTablesItem[],subed:SubscribtionTablesItem[]):void{
    let unSubscribedItems = notSubed.filter(item => item.name.trim() !== '');
    this.unsubscribedElements=unSubscribedItems;

    let subscribedItems = subed.filter(item => item.name.trim() !== '');
    this.subscribedElements=subscribedItems;
  }  
  GetSubscribedElements():SubscribtionTablesItem[]{
    return this.subscribedElements;
  }
}
