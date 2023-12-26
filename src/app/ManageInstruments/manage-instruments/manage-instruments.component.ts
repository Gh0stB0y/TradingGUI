import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { last } from 'rxjs';
import { NotSubscribedTable as SubscribeMenuTableRecord } from 'src/Models/NotSubscribedTable';
import { HttpServicesService } from 'src/app/Services/http-services.service';
import { SignalRService } from 'src/app/Services/signalr.service';

@Component({
  selector: 'app-manage-instruments',
  templateUrl: './manage-instruments.component.html',
  styleUrls: ['./manage-instruments.component.scss',
              "../../../../css/main.min.css"]
})
export class ManageInstrumentsComponent implements OnInit {


  currentPage:number[] = [1,1];
  multipage: boolean[] = [false,false];
  paginationCheck: boolean[][] = [[],[]];
  paginationDisplay: number[][] = [[],[]];
  paginationLength: number[]=[5,5];
  recordPerPage:number=8;
  

  currentNavbar: number = 0;
  navbarCheck: boolean[]=[true,false];

  initialWaiting: boolean =false;
  
  
  notSubscribedElements: SubscribeMenuTableRecord[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:5"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:6"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:7"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:8"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:9"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:10"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:11"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:12"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:13"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:14"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:15"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:16"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:17"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:18"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:19"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:20"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:21"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:22"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:23"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:24"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:25"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:26"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:27"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:28"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:29"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:30"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:31"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:32"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:33"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:34"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:35"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:36"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:37"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:38"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:39"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:40"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:41"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:42"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:43"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:44"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:45"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:46"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:47"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:48"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:49"}];
  // notSubscribedElements: SubscribeMenuTableRecord[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"}];
  // notSubscribedElements: NotSubscribedTable[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"}];
  notSubscribedTablePage: SubscribeMenuTableRecord[]=[];
  
  // subscribedElements: SubscribeMenuTableRecord[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:5"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:6"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:7"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:8"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:9"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:10"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:11"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:12"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:13"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:14"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:15"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:16"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:17"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:18"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:19"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:20"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:21"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:22"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:23"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:24"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:25"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:26"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:27"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:28"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:29"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:30"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:31"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:32"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:33"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:34"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:35"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:36"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:37"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:38"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:39"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:40"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:41"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:42"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:43"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:44"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:45"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:46"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:47"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:48"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:49"}];
  subscribedElements: SubscribeMenuTableRecord[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"}];
  constructor(private httpService:HttpServicesService, private router:Router, private signalRService : SignalRService) 
  {
    this.UpdateTables();
    this.CreatePagination();
  }
  
  ngOnInit(): void {
    console.log("DUMMY");
  }

  CreatePagination() {
    this.paginationCheck[0]=[];
    this.paginationDisplay[0]=[];
    this.paginationCheck[1]=[];
    this.paginationDisplay[1]=[];

    if(this.notSubscribedElements.length/this.recordPerPage>=this.paginationLength[0])
    {
      for(let i=0;i<this.paginationLength[0];i++)
      {
        this.paginationCheck[0].push(false);
        this.paginationDisplay[0].push(i+1);
      }
    }
    else
    {
      for(let i=0;i<this.notSubscribedElements.length/this.recordPerPage;i++)
      {
        this.paginationCheck[0].push(false);
        this.paginationDisplay[0].push(i+1);
      }
    }
    //////////////////////////////////////////////////////////////////////////////////////
    if(this.subscribedElements.length/this.recordPerPage>=this.paginationLength[1])
    {
      for(let i=0;i<this.paginationLength[1];i++)
      {
        this.paginationCheck[1].push(false);
        this.paginationDisplay[1].push(i+1);
      }
    }
    else
    {
      for(let i=0;i<this.subscribedElements.length/this.recordPerPage;i++)
      {
        this.paginationCheck[1].push(false);
        this.paginationDisplay[1].push(i+1);
      }
    }
    

    this.paginationCheck[0][0]=true;
    this.paginationCheck[1][0]=true;
  }
  RecordsPerPage(): any[] {
    return new Array(this.recordPerPage);
  }
  

  ChangePage(UnsubscribedTable:boolean,page:number){

    if(UnsubscribedTable===true)
    {
      if(page>0&&page<this.notSubscribedElements.length/8+1)                     
        this.currentPage[0]=page;                   
    }
    else
    {
      if(page>0&&page<this.subscribedElements.length/8+1)
        this.currentPage[1]=page;   
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


  AddBlankRecords()
  {
    while(this.notSubscribedElements.length%this.recordPerPage!==0)
    {
      this.notSubscribedElements.push({Name:"",Category:"",Ask:"",Bid:"",Leverage:""});
    }
    ///////////////////////////////////////////////////////
    while(this.subscribedElements.length%this.recordPerPage!==0)
    {
      this.subscribedElements.push({Name:"",Category:"",Ask:"",Bid:"",Leverage:""});
    }
  }
  UpdateBlankPage(){
    let count:number=0;
    for(let i=this.subscribedElements.length-this.recordPerPage;i<this.subscribedElements.length;i++)
    {
      if(this.subscribedElements[i].Name==="")
        count++;      
    }
    if(count===this.recordPerPage)
      this.subscribedElements.splice(this.subscribedElements.length-this.recordPerPage,this.recordPerPage);
    /////////////////////////////////////////////////////////////////////////////////
    count=0;
    for(let i=this.notSubscribedElements.length-this.recordPerPage;i<this.notSubscribedElements.length;i++)
    {
      if(this.notSubscribedElements[i].Name==="")
        count++;      
    }
    if(count===this.recordPerPage)
      this.notSubscribedElements.splice(this.notSubscribedElements.length-this.recordPerPage,this.recordPerPage);
  }
  UpdateCurrentPage() {
    if(this.currentPage[1]>=this.subscribedElements.length/8+1)
    {
      this.currentPage[1]=this.subscribedElements.length/8;
    }
    if(this.currentPage[0]>=this.notSubscribedElements.length/8+1)
    {
      this.currentPage[0]=this.notSubscribedElements.length/8;
    }
  }  
  UpdateMultiPage() {
    if(this.subscribedElements.length>this.recordPerPage)
      this.multipage[1]=true;
    else
      this.multipage[1]=false;

    if(this.notSubscribedElements.length>this.recordPerPage)
      this.multipage[0]=true;
    else
      this.multipage[0]=false;
  }
  UpdateTables() {
    this.AddBlankRecords();
    this.UpdateBlankPage();
    this.UpdateCurrentPage();
    this.UpdateMultiPage();
  }



  DeleteRecord(i:number) 
  {    
    this.subscribedElements.splice((this.currentPage[1]-1)*8+i, 1);    
    this.UpdateTables();
  }
  AddRecord(i:number) 
  {
    if(this.subscribedElements[this.subscribedElements.length-1].Name==="")
    {
      for(let i=this.subscribedElements.length-this.recordPerPage;i<this.subscribedElements.length;i++)
      {
        if(this.subscribedElements[i].Name==="")
        {
          this.subscribedElements[i]={Name:"Another element",Category:"Dummy",Ask:"0",Bid:"0",Leverage:"0:0"};
          break;
        }
      }
    }      
    else
    {
      this.subscribedElements.push({Name:"Another element",Category:"Dummy",Ask:"0",Bid:"0",Leverage:"0:0"});
    }
    this.UpdateTables();   
  }
}
