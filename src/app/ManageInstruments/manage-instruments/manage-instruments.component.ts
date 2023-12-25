import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { last } from 'rxjs';
import { NotSubscribedTable } from 'src/Models/NotSubscribedTable';
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
  paginationCheck: boolean[][] = [[]];
  paginationDisplay: number[][] = [[]];
  paginationLength: number[]=[5,5];
  recordPerPage:number=8;
  

  currentNavbar: number = 0;
  navbarCheck: boolean[]=[true,false];

  initialWaiting: boolean =false;
  
  
  notSubscribedElements: NotSubscribedTable[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:5"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:6"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:7"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:8"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:9"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:10"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:11"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:12"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:5"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:6"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:7"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:8"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:9"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:10"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:11"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:12"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:5"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:6"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:7"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:8"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:9"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:10"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:11"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:12"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:5"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:6"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:7"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:8"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:9"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:10"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:11"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:12"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"}];
  // notSubscribedElements: NotSubscribedTable[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"}];
  // notSubscribedElements: NotSubscribedTable[]=[{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:1"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:2"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:3"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"},{Name:"OIL.WTI",Category:"Commodities",Ask:"75.99",Bid:"76.12",Leverage:"1:4"}];
  notSubscribedTablePage: NotSubscribedTable[]=[];
  
  constructor(private httpService:HttpServicesService, private router:Router, private signalRService : SignalRService) 
  {
    if(this.notSubscribedElements.length>this.recordPerPage)
    {
      this.multipage[0] = true;
      for(let i=0;i<this.recordPerPage;i++)
        this.notSubscribedTablePage.push(this.notSubscribedElements[i]);


      if(this.notSubscribedElements.length/this.recordPerPage>this.paginationLength[0])
      {
        for(let j=0;j<this.paginationLength[0];j++)
        this.paginationCheck[0].push(false);
      this.paginationCheck[0][0]=true;
      }
      else
      {        
        for(let j=0;j<this.notSubscribedElements.length/this.recordPerPage;j++)
        this.paginationCheck[0].push(false);       
      this.paginationCheck[0][0]=true;
      }      

      for(let k=0;k<this.paginationCheck[0].length;k++)
        this.paginationDisplay[0].push(k+1);
    }
    else
    {
      this.multipage[0] = false;
      let elementsNumber = this.notSubscribedElements.length%this.recordPerPage;
      for(let i=0;i<this.notSubscribedElements.length;i++)
        this.notSubscribedTablePage.push(this.notSubscribedElements[i]);
      for(let j=0;j<this.recordPerPage-elementsNumber;j++)
        this.notSubscribedTablePage.push({Name:"",Category:"",Ask:"",Bid:"",Leverage:""});
    }
  }

  ngOnInit(): void {
    console.log("DUMMY");
  }

  ChangePage(UnsubscribedTable:boolean,page:number,outermostPagination:boolean){
    if(page>0&&page<this.notSubscribedElements.length/8+1)
    {
      if(UnsubscribedTable===true)
      {
        this.UpdatePagination(outermostPagination,page);
        
        this.currentPage[0]=page;
        this.UpdateLayout(UnsubscribedTable);
      }
      else
      {
        this.currentPage[1]=page;
        this.UpdateLayout(UnsubscribedTable);
      }
    }
  }
  UpdatePagination(outermostPagination: boolean,page:number) {
    if(outermostPagination===true)
    {
      
      if(page>this.paginationLength[0])
      {
        console.log("CHUJ");
      }
      
      else
      {
        if(this.currentPage[0]<=this.paginationLength[0])
          this.paginationCheck[0][this.currentPage[0]-1]=false;

        this.paginationCheck[0][page-1]=true;
      }      
    }
    else
    {
      this.paginationCheck[0]=[];
      if(this.notSubscribedElements.length/this.recordPerPage>this.paginationLength[0])
      {
        for(let j=0;j<this.paginationLength[0];j++)
        this.paginationCheck[0].push(false);
      this.paginationCheck[0][page-1]=true;
      }
      else
      {        
        for(let j=0;j<this.notSubscribedElements.length/this.recordPerPage;j++)
        this.paginationCheck[0].push(false);       
      this.paginationCheck[0][page-1]=true;
      }      
    }
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
  
}
