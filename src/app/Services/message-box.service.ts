import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MyMessageDTO } from 'src/Models/MyMessageDTO';

@Injectable({
  providedIn: 'root'
})
export class MessageBoxService {

  private lastMessage:MyMessageDTO={
    msgType:"Info",
    msgVal: "Everything good"
  };

  MessageSubject = new Subject<MyMessageDTO>();


  SendInternalMessage(msg:MyMessageDTO){
    this.lastMessage=msg;
    this.MessageSubject.next(msg);
  }

  InternalMessageObservable():Observable<MyMessageDTO>{
    return this.MessageSubject.asObservable();
  }

}
