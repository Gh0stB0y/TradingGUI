import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { last } from 'rxjs';
import { SubscribtionTablesItem as SubscribeMenuTableRecord, SubscribtionTablesItem } from 'src/Models/SubscribeInstruments/SubscribtionTablesItem';
import { SubscribeRequestDTO } from 'src/Models/SubscribeInstruments/SubscribeRequestDTO';
import { HttpServicesService } from 'src/app/Services/http-services.service';
import { SignalRService } from 'src/app/Services/signalr.service';
import { LoginResponseDTO } from 'src/Models/LoginResponseDTO';
import { FilterCriteria } from 'src/Models/FilterCriteria';

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
  
  notSubscribedUnfilteredElements:SubscribtionTablesItem[]=[];
  notSubscribedElements:SubscribtionTablesItem[]=[{name:" ",category:" ",ask:" ",bid:" ",leverage:" "}];
  subscribedUnfilteredElements:SubscribtionTablesItem[]=[];
  subscribedElements: SubscribtionTablesItem[]=[{name:" ",category:" ",ask:" ",bid:" ",leverage:" "}];


  filter:FilterCriteria={
    Name:'',
    Category:'',
    MinAsk:'',
    MaxAsk:'',
    MinLeverage:'',
    MaxLeverage:''
  }
  categories:string[]=[];
  sortingCategories:string[]=[];

  constructor(private httpService:HttpServicesService, private router:Router, private signalRService : SignalRService) 
  {
    this.UpdateTables();
    this.CreatePagination();
    this.sortingCategories = Object.keys(this.notSubscribedElements);
    console.log(this.sortingCategories);
  }
  
  ngOnInit(): void {

    this.GetUnsubscribedInstruments();

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
      if(page>0&&page<this.notSubscribedElements.length/this.recordPerPage+1)                     
        this.currentPage[0]=page;              
    }
    else
    {
      if(page>0&&page<this.subscribedElements.length/this.recordPerPage+1)
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
      this.notSubscribedElements.push({name:"",category:"",ask:"",bid:"",leverage:""});
    }
    ///////////////////////////////////////////////////////
    while(this.subscribedElements.length%this.recordPerPage!==0)
    {
      this.subscribedElements.push({name:"",category:"",ask:"",bid:"",leverage:""});
    }
  }
  UpdateBlankPage(){
    let count:number=0;
    for(let i=this.subscribedElements.length-this.recordPerPage;i<this.subscribedElements.length;i++)
    {
      if(this.subscribedElements[i].name==="")
        count++;      
    }
    if(count===this.recordPerPage)
      this.subscribedElements.splice(this.subscribedElements.length-this.recordPerPage,this.recordPerPage);
    /////////////////////////////////////////////////////////////////////////////////
    count=0;
    for(let i=this.notSubscribedElements.length-this.recordPerPage;i<this.notSubscribedElements.length;i++)
    {
      if(this.notSubscribedElements[i].name==="")
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
    if(this.subscribedElements[this.subscribedElements.length-1].name==="")
    {
      for(let i=this.subscribedElements.length-this.recordPerPage;i<this.subscribedElements.length;i++)
      {
        if(this.subscribedElements[i].name==="")
        {
          this.subscribedElements[i]={name:"Another element",category:"Dummy",ask:"0",bid:"0",leverage:"0:0"};
          break;
        }
      }
    }      
    else
    {
      this.subscribedElements.push({name:"Another element",category:"Dummy",ask:"0",bid:"0",leverage:"0:0"});
    }
    this.UpdateTables();   
  }




  GetUnsubscribedInstruments():void{
    this.signalRService.UnsubscribedInstrumentsListener().subscribe((data)=>{
      console.log(data);
      console.log(data[4]);
      this.notSubscribedUnfilteredElements=[];
      for (let item of data){
        let tableRecord:SubscribtionTablesItem = {name:item.name, category:item.category,ask:item.ask.toString(),bid:item.bid.toString(),leverage:item.leverage.toString()};
        this.notSubscribedUnfilteredElements.push(tableRecord);
      }

      this.GetCategories(this.notSubscribedUnfilteredElements);
      this.onSearchInput(this.filter);
      this.UpdateTables();
    });
  }
 
  GetSubscribedElements():void{

  }
  SubscribeItem():void{
    let token = localStorage.getItem("token");
    if(token)
    {
      let instrument:SubscribeRequestDTO={Jwt:token,Instrument:"USDPLN"};
      this.signalRService.SubscribeInstrument(instrument);
    }
  }


  GetCategories(objects:SubscribeMenuTableRecord[]) {
    this.categories= Array.from(new Set(objects.map(obj => obj.category)));
  }
  SetCategoryFilter(category:string){
    this.filter.Category=category;
    this.onSearchInput(this.filter);
  }
  onSearchInput(filter:FilterCriteria) {
    if(filter != null)
    {
      this.notSubscribedElements = this.notSubscribedUnfilteredElements;

      if(filter.Name !=="")
      {
        this.notSubscribedElements = this.notSubscribedUnfilteredElements.filter(item => item.name.toUpperCase().startsWith(this.filter.Name.toUpperCase()));
      }
      if(filter.Category !=="")
      {
        this.notSubscribedElements = this.notSubscribedElements.filter(item => item.category.toUpperCase() === (this.filter.Category.toUpperCase()));
      }
      if(filter.MinAsk !=="")
      { 
        this.notSubscribedElements = this.notSubscribedElements.filter(item => parseFloat(item.ask) >= (parseFloat(filter.MinAsk)));
      }
      if(filter.MaxAsk !=="")
      { 
        this.notSubscribedElements = this.notSubscribedElements.filter(item => parseFloat(item.ask) <= (parseFloat(filter.MaxAsk)));
      }
      if(filter.MinLeverage !=="")
      { 
        this.notSubscribedElements = this.notSubscribedElements.filter(item => parseFloat(item.leverage) >= (parseFloat(filter.MinLeverage)));
      }
      if(filter.MaxLeverage !=="")
      { 
        this.notSubscribedElements = this.notSubscribedElements.filter(item => parseFloat(item.leverage) <= (parseFloat(filter.MaxLeverage)));
      }
      this.UpdateTables();
    }
  }
}
