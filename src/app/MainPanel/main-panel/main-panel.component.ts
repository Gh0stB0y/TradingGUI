import { NgFor } from '@angular/common';
import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { LoginResponseDTO } from 'src/Models/LoginResponseDTO';
import { MyMessageDTO } from 'src/Models/MyMessageDTO';
import { SubscribeRequestDTO } from 'src/Models/SubscribeInstruments/SubscribeRequestDTO';
import { SubscribedItemDTO } from 'src/Models/SubscribeInstruments/SubscribedItemSimple';
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
  elements:SubscribedItemDTO[]=[];
  initialWaiting: boolean =true;
  intervals:string [] =['M1', 'M5', 'M15','M30', 'H1', 'H4', 'D1', 'W1'];
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
           this.NewSubscribtionListener();
           this.RemoveSubscribtionListener();
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
  UnsubscribeItem(instrumentName:string):void{
    let token = localStorage.getItem("token");
    if(token)
    {
      let instrument:SubscribeRequestDTO={Jwt:token,Instrument:instrumentName};
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
      localStorage.setItem("sessionId",data.sessionId);
      localStorage.setItem("token", data.token);
    });
  }
  NewSubscribtionListener():void{
    this.signalRService.NewSubscribtionListener().subscribe((instrument)=>{
      this.elements.push({name:instrument.name,Intervals:this.intervals});
   
    });
  }
  RemoveSubscribtionListener():void{
    this.signalRService.RemoveSubscribtionListener().subscribe((instrument)=>{
      this.elements = this.elements.filter(item=>item.name!==instrument);
    });
  }
  //

}
