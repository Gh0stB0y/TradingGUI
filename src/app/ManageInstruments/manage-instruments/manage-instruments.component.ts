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
  
  
  // notSubscribedElements: SubscribeMenuTableRecord[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:5"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:6"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:7"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:8"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:9"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:10"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:11"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:12"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:13"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:14"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:15"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:16"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:17"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:18"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:19"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:20"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:21"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:22"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:23"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:24"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:25"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:26"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:27"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:28"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:29"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:30"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:31"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:32"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:33"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:34"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:35"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:36"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:37"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:38"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:39"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:40"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:41"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:42"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:43"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:44"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:45"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:46"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:47"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:48"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:49"}];
  notSubscribedElements: SubscribeMenuTableRecord[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"}];
  // notSubscribedElements: NotSubscribedTable[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"}];
  notSubscribedTablePage: SubscribeMenuTableRecord[]=[];
  
  // subscribedElements: SubscribeMenuTableRecord[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:5"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:6"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:7"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:8"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:9"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:10"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:11"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:12"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:13"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:14"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:15"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:16"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:17"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:18"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:19"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:20"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:21"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:22"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:23"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:24"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:25"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:26"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:27"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:28"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:29"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:30"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:31"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:32"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:33"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:34"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:35"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:36"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:37"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:38"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:39"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:40"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:41"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:42"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:43"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:44"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:45"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:46"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:47"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:48"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"2:49"}];
  subscribedElements: SubscribeMenuTableRecord[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"}];
  subscribedTablePage: SubscribeMenuTableRecord[]=[];
  constructor(private httpService:HttpServicesService, private router:Router, private signalRService : SignalRService) 
  {
    this.InitialTable1Setup();
    this.InitialTable2Setup();     
    this.AddBlankRecords();
  }

  ngOnInit(): void {
    console.log("DUMMY");
  }

  ChangePage(UnsubscribedTable:boolean,page:number,outermostPagination:boolean){

    if(UnsubscribedTable===true)
    {
      if(page>0&&page<this.notSubscribedElements.length/8+1)
      {                 
        this.UpdatePagination1(outermostPagination,page);        
        this.currentPage[0]=page;
        this.UpdateLayout(UnsubscribedTable);                    
      }
    }
    else
    {
      if(page>0&&page<this.subscribedElements.length/8+1)
      {
        this.UpdatePagination2(outermostPagination,page);
        this.currentPage[1]=page;
        this.UpdateLayout(UnsubscribedTable);
      }
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
    if(navbarId===1)
    this.UpdateLayout(false);
    else
    this.UpdateLayout(true);
  console.log(123);
  }
  UpdateLayout(UnsubscribedTable: boolean) {
    if(UnsubscribedTable===true)
    {      
      this.notSubscribedTablePage=[];
      if(this.notSubscribedElements.length<this.currentPage[0]*8)
      {
        for(let i=0;i<this.notSubscribedElements.length%8;i++)
          this.notSubscribedTablePage.push(this.notSubscribedElements[(this.currentPage[0]-1)*8+i]);        
        for(let i=this.notSubscribedElements.length%8;i<this.recordPerPage;i++)
          this.notSubscribedTablePage.push({Name:"",Category:"",Ask:"",Bid:"",Leverage:""});
      }
      else
      {
        for(let i=0;i<this.recordPerPage;i++)
          this.notSubscribedTablePage.push(this.notSubscribedElements[(this.currentPage[0]-1)*8+i]);
      }      
    }
    else
    {
      this.subscribedTablePage=[];
      if(this.subscribedElements.length<this.currentPage[1]*8)
      {
        for(let i=0;i<this.subscribedElements.length%8;i++)
          this.subscribedTablePage.push(this.subscribedElements[(this.currentPage[1]-1)*8+i]);        
        for(let i=this.subscribedElements.length%8;i<this.recordPerPage;i++)
          this.subscribedTablePage.push({Name:"",Category:"",Ask:"",Bid:"",Leverage:""});
      }
      else
      {
        for(let i=0;i<this.recordPerPage;i++)
          this.subscribedTablePage.push(this.subscribedElements[(this.currentPage[1]-1)*8+i]);
      }      
    }
  }
  UpdatePagination1(outermostPagination: boolean,page:number) {
    if(outermostPagination===true)
    {
      if(this.paginationCheck[0][this.paginationCheck[0].length-1]===true||this.paginationCheck[0][0]===true)
      {
        if(page>this.paginationDisplay[0][this.paginationDisplay[0].length-1])
        {
          for(let j=0;j<this.paginationDisplay[0].length;j++)
            this.paginationDisplay[0][j]=this.paginationDisplay[0][j]+1;
        }
        else if(page<this.paginationDisplay[0][0])
        {
          for(let j=0;j<this.paginationDisplay[0].length;j++)
            this.paginationDisplay[0][j]=this.paginationDisplay[0][j]-1;
        }
        else
        {
          for(let k=0;k<this.paginationCheck[0].length;k++)
          {
            this.paginationCheck[0][k]=false;
            if(page===this.paginationDisplay[0][k])
              this.paginationCheck[0][k]=true;
          }        
        }
      }
      else
      {
        for(let k=0;k<this.paginationCheck[0].length;k++)
        {
          this.paginationCheck[0][k]=false;
          if(page===this.paginationDisplay[0][k])
            this.paginationCheck[0][k]=true;
        }
      }      
    }
    else
    {
      this.paginationCheck[0]=[];
      if(this.notSubscribedElements.length/this.recordPerPage>this.paginationLength[0])
      {
        for(let j=0;j<this.paginationLength[0];j++)
        {
          this.paginationCheck[0].push(false);
          if(page===this.paginationDisplay[0][j])
            this.paginationCheck[0][j]=true;
        }      
      }
      else
      {        
        for(let j=0;j<this.notSubscribedElements.length/this.recordPerPage;j++)
        this.paginationCheck[0].push(false);       
      this.paginationCheck[0][page-1]=true;
      }      
    }
  }
  UpdatePagination2(outermostPagination: boolean,page:number) {
    if(outermostPagination===true)
    {
      if(this.paginationCheck[1][this.paginationCheck[1].length-1]===true||this.paginationCheck[1][0]===true)
      {
        if(page>this.paginationDisplay[1][this.paginationDisplay[1].length-1])
        {
          for(let j=0;j<this.paginationDisplay[1].length;j++)
            this.paginationDisplay[1][j]=this.paginationDisplay[1][j]+1;
        }
        else if(page<this.paginationDisplay[1][0])
        {
          for(let j=0;j<this.paginationDisplay[1].length;j++)
            this.paginationDisplay[1][j]=this.paginationDisplay[1][j]-1;
        }
        else
        {
          for(let k=0;k<this.paginationCheck[1].length;k++)
          {
            this.paginationCheck[1][k]=false;
            if(page===this.paginationDisplay[1][k])
              this.paginationCheck[1][k]=true;
          }        
        }
      }
      else
      {
        for(let k=0;k<this.paginationCheck[1].length;k++)
        {
          this.paginationCheck[1][k]=false;
          if(page===this.paginationDisplay[1][k])
            this.paginationCheck[1][k]=true;
        }
      }      
    }
    else
    {
      this.paginationCheck[1]=[];
      if(this.subscribedElements.length/this.recordPerPage>this.paginationLength[1])
      {
        for(let j=0;j<this.paginationLength[1];j++)
        {
          this.paginationCheck[1].push(false);
          if(page===this.paginationDisplay[1][j])
            this.paginationCheck[1][j]=true;
        }      
      }
      else
      {        
        for(let j=0;j<this.subscribedElements.length/this.recordPerPage;j++)
        this.paginationCheck[1].push(false);       
      this.paginationCheck[1][page-1]=true;
      }      
    }
  }
  

  InitialTable1Setup():void {
    if (this.notSubscribedElements.length > this.recordPerPage) {
      this.multipage[0] = true;
      for (let i = 0; i < this.recordPerPage; i++)
        this.notSubscribedTablePage.push(this.notSubscribedElements[i]);


      if (this.notSubscribedElements.length / this.recordPerPage > this.paginationLength[0]) {
        for (let j = 0; j < this.paginationLength[0]; j++)
          this.paginationCheck[0].push(false);
        this.paginationCheck[0][0] = true;
      }

      else {
        for (let j = 0; j < this.notSubscribedElements.length / this.recordPerPage; j++)
          this.paginationCheck[0].push(false);
        this.paginationCheck[0][0] = true;
      }

      for (let k = 0; k < this.paginationCheck[0].length; k++)
        this.paginationDisplay[0].push(k + 1);
    }

    else {
      this.multipage[0] = false;
      let elementsNumber = this.notSubscribedElements.length % this.recordPerPage;
      for (let i = 0; i < this.notSubscribedElements.length; i++)
        this.notSubscribedTablePage.push(this.notSubscribedElements[i]);
      for (let j = 0; j < this.recordPerPage - elementsNumber; j++)
        this.notSubscribedTablePage.push({ Name: "", Category: "", Ask: "", Bid: "", Leverage: "" });
    }
  }
  InitialTable2Setup():void {
    if (this.subscribedElements.length > this.recordPerPage) {
      this.multipage[1] = true;
      for (let i = 0; i < this.recordPerPage; i++)
        this.subscribedTablePage.push(this.subscribedElements[i]);


      if (this.subscribedElements.length / this.recordPerPage > this.paginationLength[1]) {
        for (let j = 0; j < this.paginationLength[1]; j++)
          this.paginationCheck[1].push(false);
        this.paginationCheck[1][0] = true;
      }

      else {
        for (let j = 0; j < this.subscribedElements.length / this.recordPerPage; j++)
          this.paginationCheck[1].push(false);
        this.paginationCheck[1][0] = true;
      }

      for (let k = 0; k < this.paginationCheck[1].length; k++)
        this.paginationDisplay[1].push(k + 1);
    }

    else {
      this.multipage[1] = false;
      let elementsNumber = this.subscribedElements.length % this.recordPerPage;
      for (let i = 0; i < this.subscribedElements.length; i++)
        this.subscribedTablePage.push(this.subscribedElements[i]);
      for (let j = 0; j < this.recordPerPage - elementsNumber; j++)
        this.subscribedTablePage.push({ Name: "", Category: "", Ask: "", Bid: "", Leverage: "" });
    }
  }



  AddBlankRecords()
  {

    while(this.subscribedElements.length%this.recordPerPage!==0)
    {
      this.subscribedElements.push({Name:"",Category:"",Ask:"",Bid:"",Leverage:""});
    }
  }
  RecordsPerPage(): any[] {
    return new Array(this.recordPerPage);
  }
  DeleteRecord(i:number) 
  {
    
    this.subscribedElements.splice((this.currentPage[1]-1)*8+i, 1);
    console.log(this.subscribedElements.length);
    //this.AddBlankRecords();
  }
  AddRecord(i:number) 
  {
    this.subscribedElements.push({Name:"Another element",Category:"Dummy",Ask:"0",Bid:"0",Leverage:"0:0"});

  }
}
