import { Injectable } from '@angular/core';
import { ChartRecord } from '../MainPanel/main-panel/chartData';
import { SubscribtionTablesItem } from 'src/Models/SubscribeInstruments/SubscribtionTablesItem';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  private chartData: ChartRecord[] = [];
  private unsubscribedElements:SubscribtionTablesItem[]=[];

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

    let index = this.chartData.findIndex(e=>e.name === name && e.interval === interval);
    if(index === -1)
    {
      console.log("Name not found");
      throw new Error("Name not found");
    }
    else
    {
      return this.chartData[index];
    }
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
  UpdateUnsubscribedElements(data:SubscribtionTablesItem[]):void{
    this.unsubscribedElements=data;
  }
}
