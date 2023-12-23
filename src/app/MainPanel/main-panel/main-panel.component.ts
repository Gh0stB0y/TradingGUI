import { NgFor } from '@angular/common';
import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponseDTO } from 'src/Models/LoginResponseDTO';
import { SubscribeInstrumentDTO } from 'src/Models/SubscribeInstrumentDTO';
import { SubscribedItemUI } from 'src/Models/SubscribedItemUI';
import { Logout as LogoutClear } from 'src/app/GlobalMethods/Logout';
import { HttpServicesService } from 'src/app/Services/http-services.service';
import { SignalRService } from 'src/app/Services/signalr.service';

@Component({
  selector: 'app-main-panel',
  templateUrl:'./main-panel.component.html',
  styleUrls: ['./main-panel.component.scss',
              "../../../../css/main.min.css"]
})
export class MainPanelComponent implements OnInit {
  constructor(private httpService:HttpServicesService, private router:Router, private signalRService : SignalRService) {}
  elements:SubscribedItemUI[]=[];
  // elements = ['OIL.WTI', 'EURUSD', 'EURPLN', 'USDPLN', 'WIG20'];
  intervals =['M5', 'M15', 'H1', 'H4', 'D1', 'W1'];
  tradeSignals =['trade1','trade1','trade1','trade1','trade1'];

  condition:number=0;
  InitialWaiting: boolean =true;
  navbarCheck:boolean[]=[false,false,false,false];
  
  ngOnInit(): void {    
    let SessionId = localStorage.getItem("sessionId");
    let Token = localStorage.getItem("token");

    if(SessionId && Token)
    {
      let data:LoginResponseDTO = {
        sessionId: SessionId.toString(),
        token: Token.toString()
      }
      this.httpService.CheckSession(data)
      .subscribe
      ({
        next: (returnData)=>{
          this.InitialWaiting=false;
          localStorage.setItem("sessionId",returnData.sessionId);
          localStorage.setItem("token", returnData.token);
          SessionId=returnData.sessionId;
          Token=returnData.token;
          data = 
            {
            sessionId: SessionId.toString(),
            token: Token.toString()
            }
          this.signalRService.startConnection(data);
        },
        error:(err) =>{
          console.error(err.error);
          this.router.navigate(['']);
        }
      });              
    }
    else
    {
      this.router.navigate(['']);
    }
  }
  ChooseNavbar(navbarId:number){
    for (let i = 0; i < this.navbarCheck.length; i++) 
    {
      this.navbarCheck[i]=false;
      if(navbarId>=0&&navbarId<this.navbarCheck.length){
        this.navbarCheck[navbarId]=true;
      }
    }
    this.condition=navbarId;
  }
  ManageSubscribtion(subscribe:boolean,data:string):void
  {
    const jwt = localStorage.getItem("token");
    if(jwt)
    {
      let instrument:SubscribeInstrumentDTO=
      {
        Jwt: jwt.toString(),
        Instrument:data
      }
      // if(subscribe)
      //   this.signalRService.SubscribeInstrument(instrument);
      // else
      //   this.signalRService.UnsubscribeInstrument(instrument);
    }    
  }
  Logout(){
    const SessionId = localStorage.getItem("sessionId");
    const Token = localStorage.getItem("token");

    if(SessionId && Token)
    {
      const data:LoginResponseDTO = 
      {
        sessionId: SessionId.toString(),
        token: Token.toString()
      }
                  
      this.signalRService.stopConnection();
    }
    LogoutClear(this.router);
  }
}
