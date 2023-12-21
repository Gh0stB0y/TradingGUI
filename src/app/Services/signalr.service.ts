import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { SubscribeInstrumentDTO } from 'src/Models/SubscribeInstrumentDTO';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  constructor() {
    // Set up the connection
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7077/TradingHub')
      .build();
    this.startConnection();
  }

  private startConnection() {
    this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
        // You can subscribe to hub events here if needed
        // this.hubConnection.on('SomeHubEvent', (data) => { /* handle event */ });
      })
      .catch(err => console.error('Error while starting connection:', err));
  }

  // Method to send a message to the server
  SubscribeInstrument(instrument: SubscribeInstrumentDTO) {
    this.hubConnection.invoke('SubscribeInstrument', instrument)
      .catch(err => console.error('Error:', err));
  }
  UnsubscribeInstrument(instrument: SubscribeInstrumentDTO) {
    this.hubConnection.invoke('UnsubscribeInstrument', instrument)
      .catch(err => console.error('Error:', err));
  }
}