import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Callbacks, data, error } from 'jquery';
import { Observable, Subject } from 'rxjs';
import { LoginResponseDTO } from 'src/Models/LoginResponseDTO';
import { MyMessageDTO } from 'src/Models/MyMessageDTO';
import { SubscribeRequestDTO } from 'src/Models/SubscribeInstruments/SubscribeRequestDTO';
import { SubscribtionTablesDTO } from 'src/Models/SubscribeInstruments/SubscribtionTablesDTO';
import { SubscribtionTablesItem } from 'src/Models/SubscribeInstruments/SubscribtionTablesItem';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  
  private hubConnection: HubConnection;
  private TokenUpdateSubject: Subject<LoginResponseDTO> = new Subject<LoginResponseDTO>();
  private MessageSubject: Subject<MyMessageDTO> = new Subject<MyMessageDTO>();
  private LogoutSubject: Subject<any> = new Subject<any>();
  private UnsubscribedInstrumentsSubject: Subject<SubscribtionTablesDTO[]> = new Subject<SubscribtionTablesDTO[]>();
  constructor() 
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

          const data:LoginResponseDTO = {sessionId:SessionId, token:Token}
          this.GetUnsubscribedInstruments(data);
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
  SubscribeInstrument(instrument: SubscribeRequestDTO) {
    this.hubConnection.invoke('SubscribeInstrument', instrument);
  }
  UnsubscribeInstrument(instrument: SubscribeRequestDTO) {
    this.hubConnection.invoke('UnsubscribeInstrument', instrument);
  }
  GetUnsubscribedInstruments(credentials: LoginResponseDTO) {
    this.hubConnection.invoke('GetUnsubscribedInstruments', credentials);
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
  
}