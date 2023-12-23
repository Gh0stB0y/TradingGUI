import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { LoginResponseDTO } from 'src/Models/LoginResponseDTO';
import { SubscribeInstrumentDTO } from 'src/Models/SubscribeInstrumentDTO';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
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
          // You can subscribe to hub events here if needed
          // this.hubConnection.on('SomeHubEvent', (data) => { /* handle event */ });
        })
        .catch(err => console.error('Error while starting connection:', err));
    }
    
  }
  stopConnection()
  {
    this.hubConnection.stop();
  }

  // Method to send a message to the server
  SubscribeInstrument(instrument: SubscribeInstrumentDTO) {
    this.hubConnection.invoke('SubscribeInstrument', instrument);

  }
  UnsubscribeInstrument(instrument: SubscribeInstrumentDTO) {
    this.hubConnection.invoke('UnsubscribeInstrument', instrument);
  }
}