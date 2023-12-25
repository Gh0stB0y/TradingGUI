import { NgFor } from '@angular/common';
import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { LoginResponseDTO } from 'src/Models/LoginResponseDTO';
import { MyMessageDTO } from 'src/Models/MyMessageDTO';
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

  accountId:string = "";
  currentNavbar:number=1;
  elements:SubscribedItemUI[]=[];
  // elements = ['OIL.WTI', 'EURUSD', 'EURPLN', 'USDPLN', 'WIG20'];
  initialWaiting: boolean =true;
  intervals:string [] =['M5', 'M15', 'H1', 'H4', 'D1', 'W1'];
  messages:MyMessageDTO[] = [];
  navbarCheck:boolean[]=[false,false,false,false];
  tradeSignals:string [] =['trade1','trade1','trade1','trade1','trade1','trade1','trade1','trade1','trade1','trade1','trade1','trade1','trade1','trade1','trade1','trade1','trade1'];
  

  
  ngOnInit(): void {    
    this.ChooseNavbar(this.currentNavbar);
    let accountId = localStorage.getItem("accountId");
    if(accountId) this.accountId = accountId.toString();
    
    let sessionId = localStorage.getItem("sessionId");
    let token = localStorage.getItem("token");
    
    if(sessionId && token)
    {
      let data:LoginResponseDTO = {
        sessionId: sessionId.toString(),
        token: token.toString()
      }
      this.httpService.CheckSession(data)
      .subscribe
      ({
        next: (returnData)=>{
          this.initialWaiting=false;
          localStorage.setItem("sessionId",returnData.sessionId);
          localStorage.setItem("token", returnData.token);
          sessionId=returnData.sessionId;
          token=returnData.token;
          data = 
            {
            sessionId: sessionId.toString(),
            token: token.toString()
            };
           this.signalRService.startConnection(data);
           this.TokenUpdateListener();
           this.ErrorMessageListener();
           this.LogoutListener();
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
    this.currentNavbar=navbarId;
  }
  ClearChat():void{
    this.messages=[];
  }
  Logout(){
    this.signalRService.Logout();
    LogoutClear(this.router);
    this.router.navigate(['']);
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
       if(subscribe)
         this.signalRService.SubscribeInstrument(instrument);
       else
         this.signalRService.UnsubscribeInstrument(instrument);
    }    
  }
  //Listeners
  ErrorMessageListener():void{
    this.signalRService.MessageListener().subscribe((error)=>
    {
      this.messages.push(error);
    })
  }
  LogoutListener():void{
    this.signalRService.LogoutListener().subscribe(()=>
    {
      this.Logout();
      this.router.navigate(['']);
    });
  }
  TokenUpdateListener():void{
    this.signalRService.UpdateTokenListener().subscribe((data) => 
    {
      console.log(data.sessionId);
      console.log(data.token);
      localStorage.setItem("sessionId",data.sessionId);
      localStorage.setItem("token", data.token);
    });
  }
  //

}
