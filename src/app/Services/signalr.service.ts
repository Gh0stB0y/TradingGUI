import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Callbacks, data, error } from 'jquery';
import { Observable, Subject, delay } from 'rxjs';
import { LoginResponseDTO } from 'src/Models/LoginResponseDTO';
import { MyMessageDTO } from 'src/Models/MyMessageDTO';
import { SubscribeRequestDTO } from 'src/Models/SubscribeInstruments/SubscribeRequestDTO';
import { SubscribtionTablesDTO } from 'src/Models/SubscribeInstruments/SubscribtionTablesDTO';
import { SubscribtionTablesItem } from 'src/Models/SubscribeInstruments/SubscribtionTablesItem';
import {ChartRecordDTO} from 'src/Models/ManageCharts/ChartRecordDTO'
import { UpdateDataForm } from 'src/Models/ManageCharts/UpdateDataForm';
import { ChartRecord } from '../MainPanel/main-panel/chartData';
import { UpdateChartDTO } from 'src/Models/ManageCharts/UpdateChartDTO';
import { ChartDataService } from './chart-data.service';
import { LoadUnsubscribedForm } from 'src/Models/ManageCharts/LoadUnsubscribedForm';
import { InitializeProcessorDTO } from 'src/Models/InitializeProcessorDTO';
import { ProcessedInstrumentDTO } from 'src/Models/ProcessedInstrumentDTO';
import { UpdateProcessedInstrumentDTO } from 'src/Models/UpdateProcessedInstrumentDTO';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  
  private hubConnection: HubConnection;
  private TokenUpdateSubject: Subject<LoginResponseDTO> = new Subject<LoginResponseDTO>();
  private MessageSubject: Subject<MyMessageDTO> = new Subject<MyMessageDTO>();
  private LogoutSubject: Subject<any> = new Subject<any>();
  private UnsubscribedInstrumentsSubject: Subject<SubscribtionTablesDTO[]> = new Subject<SubscribtionTablesDTO[]>();
  private NewSubscribtionSubject: Subject<SubscribtionTablesDTO> = new Subject<SubscribtionTablesDTO>();
  private RemoveSubscribtionSubject: Subject<string> = new Subject<string>();
  private ChartRecordSubject: Subject<ChartRecordDTO> = new Subject<ChartRecordDTO>();
  private UpdateChartSubject: Subject<UpdateChartDTO> = new Subject<UpdateChartDTO>();
  constructor(private charDataService:ChartDataService) 
  {
    // Set up the connection
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('dummy')
      .build();
  }

  startConnection(data:LoginResponseDTO) 
  {
    const SessionId = data.sessionId.toString();
    const Token = data.token.toString();
    if(SessionId&&Token)
    {
      this.hubConnection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7077/TradingHub?param1=${SessionId}&param2=${Token}`)
      .build();
  
      this.hubConnection.start()
        .then(() => {
          console.log('Connection started');
          this.hubConnection.on('TokenUpdate', (data: LoginResponseDTO) => {
            this.TokenUpdateSubject.next(data);
          });
          this.hubConnection.on("Msg",(error:MyMessageDTO)=>{
            this.MessageSubject.next(error);
          });
          this.hubConnection.on("Logout",()=>{
            this.LogoutSubject.next("");
          });
          this.hubConnection.on("UnsubscribedInstruments",(data:SubscribtionTablesDTO[])=>{
            this.UnsubscribedInstrumentsSubject.next(data);
          });
          this.hubConnection.on("NewSubscribtion",(instrument:SubscribtionTablesDTO)=>{
            this.NewSubscribtionSubject.next(instrument);
          });
          this.hubConnection.on("RemoveSubscribtion",(instrument:string)=>{
            this.RemoveSubscribtionSubject.next(instrument);
          });
          this.hubConnection.on("ChartRecord",(chartRec:ChartRecordDTO)=>{
            this.ChartRecordSubject.next(chartRec);
          });
          this.hubConnection.on("UpdateChart",(chartRecords:UpdateChartDTO)=>{
            this.UpdateChartSubject.next(chartRecords);
          });

          const data:LoginResponseDTO = {sessionId:SessionId, token:Token}
          this.GetUnsubscribedInstruments(data);
          this.GetUnsubscribedCategories();

        })
        .catch(err => console.error('Error while starting connection:', err));

        
    }    
  }
  stopConnection()
  {
    this.hubConnection.stop();
  }
//////////////////////////////////////////////////////
  Logout() {
    this.hubConnection.invoke("Logout");
  }
  // Method to send a message to the server
  async IsProcessorInitialized(token:string):Promise<boolean>{    
    while(this.hubConnection.state !== "Connected")
    {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    let response:boolean;
    await this.hubConnection.invoke('IsProcessorInitialiazed',token).then((data:boolean)=>{
      response=data;
    });
    return response;
  }
  async InitializeProcessor(form:InitializeProcessorDTO,token:string):Promise<boolean>{
    let answer:boolean;
    await this.hubConnection.invoke('InitializeProcessor',form,token).then((data:boolean)=>{
      answer = data;
    });  
    return answer;
  }
  async GetProcessorValues(token:string):Promise<ProcessedInstrumentDTO[]>{
    let answer:ProcessedInstrumentDTO[];
    await this.hubConnection.invoke('GetProcessorValues',token).then((data:ProcessedInstrumentDTO[])=>{
      answer=data;
    });
    return answer;
  }
  SubscribeInstrument(instrument: SubscribeRequestDTO) {
    this.hubConnection.invoke('SubscribeInstrument', instrument);
  }
  UnsubscribeInstrument(instrument: SubscribeRequestDTO) {
    this.hubConnection.invoke('UnsubscribeInstrument', instrument);
  }
  GetUnsubscribedInstruments(credentials: LoginResponseDTO) {
    this.hubConnection.invoke('GetUnsubscribedInstruments', credentials);
  }
  async GetUnsubscribedInstrumentsByCat(selectedCategory: string): Promise<SubscribtionTablesDTO[]> {
    let items: SubscribtionTablesDTO[];
    await this.hubConnection.invoke("GetUnsubscribedInstrumentsByCat",selectedCategory).then((data:SubscribtionTablesDTO[])=>{
      items=data;    
    });
    return items;
  }
  UpdateAvalInstrumentsList(credentials:LoginResponseDTO){
    this.hubConnection.invoke('UpdateAvalInstrumentsList',credentials);
  }
  UpdateIntrumentData(object:UpdateDataForm, token:string){
    this.hubConnection.invoke("UpdateIntrumentData",object,token);
  }
  async LoadUnsubscribedInstrument(object:UpdateDataForm, token:string):Promise<UpdateChartDTO>{
    let SendData:UpdateChartDTO
    await this.hubConnection.invoke("LoadUnsubscribedInstrument",object,token).then((data:UpdateChartDTO)=>{
      SendData=data;
    });
    return SendData;
  }
  async UpdateProcessedInstrument(token: string,updateData:UpdateProcessedInstrumentDTO) :Promise<ProcessedInstrumentDTO> {
    let answer;
    await this.hubConnection.invoke("UpdateProcessedInstrument",token,updateData).then((data:ProcessedInstrumentDTO)=>{
      answer = data;
    });
    return answer;
  }
  GetUnsubscribedCategories() {
    this.hubConnection.invoke("UnsubscribedCategories").then((data:string[])=>  {
      this.charDataService.UpdateUnsubscribedCategories(data);
    });    
  }
  //Listeners
  LogoutListener():Observable<any>{
    return this.LogoutSubject.asObservable();
  }
  MessageListener(): Observable<MyMessageDTO>{
    return this.MessageSubject.asObservable();
  }
  UpdateTokenListener(): Observable<LoginResponseDTO> {
    return this.TokenUpdateSubject.asObservable();
  }
  UnsubscribedInstrumentsListener(): Observable<SubscribtionTablesDTO[]> {
    return this.UnsubscribedInstrumentsSubject.asObservable();
  }
  NewSubscribtionListener(): Observable<SubscribtionTablesDTO> {
    return this.NewSubscribtionSubject.asObservable();
  }
  RemoveSubscribtionListener(): Observable<string>{
    return this.RemoveSubscribtionSubject.asObservable();
  }
  ChartRecordListener():Observable<ChartRecordDTO>{
    return this.ChartRecordSubject.asObservable();
  }
  UpdateChartListener():Observable<UpdateChartDTO>{
    return this.UpdateChartSubject.asObservable();
  }
}