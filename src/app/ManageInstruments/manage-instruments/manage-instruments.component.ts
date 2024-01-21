import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { last } from 'rxjs';
import { SubscribtionTablesItem as SubscribeMenuTableRecord, SubscribtionTablesItem } from 'src/Models/SubscribeInstruments/SubscribtionTablesItem';
import { SubscribeRequestDTO } from 'src/Models/SubscribeInstruments/SubscribeRequestDTO';
import { HttpServicesService } from 'src/app/Services/http-services.service';
import { SignalRService } from 'src/app/Services/signalr.service';
import { LoginResponseDTO } from 'src/Models/LoginResponseDTO';
import { FilterCriteria } from 'src/Models/FilterCriteria';
import { SubscribtionTablesDTO } from 'src/Models/SubscribeInstruments/SubscribtionTablesDTO';
import { data } from 'jquery';
import { ChartDataService } from 'src/app/Services/chart-data.service';

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

  initialWaiting: boolean = false;
  responseWaiting: boolean[] = [];

  notSubscribedUnfilteredElements:SubscribtionTablesItem[]=[];
  notSubscribedElements:SubscribtionTablesItem[]=[{name:" ",category:" ",ask:" ",bid:" ",leverage:" ",waitingResponse:false}];
  // subscribedUnfilteredElements:SubscribtionTablesItem[]=[];
  subscribedElements: SubscribtionTablesItem[]=[{name:" ",category:" ",ask:" ",bid:" ",leverage:" ",waitingResponse:false}];
  subscribedFilteredElements: SubscribtionTablesItem[]=[];

  filter:FilterCriteria={
    Name:'',
    Category:'',
    MinAsk:'',
    MaxAsk:'',
    MinLeverage:'',
    MaxLeverage:''
  }
  categories:string[]=[];
  sortingCategories:string[]=["Instrument","Category","Ask","Bid","Leverage"];
  ascendingSort:boolean=true;
  currentSort:string = "Sort";
  currentFilter:string = "Filter";
  currentSortOrder:string = "Ascending";

  constructor(private httpService:HttpServicesService, private router:Router, private signalRService : SignalRService, private chartDataService:ChartDataService) 
  {
    this.UpdateTables();
    this.CreatePagination();
    
  }
  
  ngOnInit(): void {
    this.UnsubscribedInstrumentsListener();
    this.NewSubscribtionListener();
    this.RemoveSubscribtionListener();
    this.GetUnsubscribedItems();
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

  /////////////VISUAL METHODS///////////////////
  AddBlankRecords()
  {
    while(this.notSubscribedElements.length%this.recordPerPage!==0)
    {
      this.notSubscribedElements.push({name:" ",category:" ",ask:" ",bid:" ",leverage:" ",waitingResponse:false});
    }
    ///////////////////////////////////////////////////////
    while(this.subscribedElements.length%this.recordPerPage!==0)
    {
      this.subscribedElements.push({name:" ",category:" ",ask:" ",bid:" ",leverage:" ",waitingResponse:false});
    }
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
  SyncTable(){
    let subscribedItems = this.subscribedElements;
    subscribedItems = this.subscribedElements.filter(item => item.name.trim() !== '');
    for(let i=0;i<subscribedItems.length;i++){
      this.notSubscribedElements=this.notSubscribedElements.filter(item=>item.name!==subscribedItems[i].name);
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
    this.SyncTable();
    this.AddBlankRecords();
    this.UpdateBlankPage();
    this.UpdateCurrentPage();
    this.UpdateMultiPage();
  }
  /////////////////////////////////////////////
  DeleteRecord(instrument:string) 
  {    
    this.subscribedElements=this.subscribedElements.filter(item=>item.name!==instrument); 
    this.GetCategories(this.notSubscribedUnfilteredElements);
      this.onSearchInput(this.filter);           
      this.UpdateTables();
      this.initialWaiting=false;
  }
  AddRecord(instrument:SubscribtionTablesDTO) 
  {
    if(this.subscribedElements[this.subscribedElements.length-1].name===" ")
    {
      for(let i=this.subscribedElements.length-this.recordPerPage;i<this.subscribedElements.length;i++)
      {
        if(this.subscribedElements[i].name===" ")
        {
          this.subscribedElements[i]={name:instrument.name,category:instrument.category,ask:instrument.ask.toString(),bid:instrument.bid.toString(),leverage:instrument.leverage.toString(),waitingResponse:false};
          break;
        }
      }
    }      
    else
    {
      this.subscribedElements.push({name:instrument.name,category:instrument.category,ask:instrument.ask.toString(),bid:instrument.bid.toString(),leverage:instrument.leverage.toString(),waitingResponse:false});
    }
    this.UpdateTables();   
  }
  ////////////////////////////////////////////

  ///////////////LISTENERS////////////////////
  NewSubscribtionListener():void{
    this.signalRService.NewSubscribtionListener().subscribe((instrument)=>{
      let index = this.notSubscribedElements.findIndex(e=>e.name === instrument.name);
      if(index === -1)
      {
        console.log("Name not found");
      }
      else
      {
        this.notSubscribedElements[index].waitingResponse=false;
      }
      this.AddRecord(instrument);
      this.chartDataService.UpdateUnsubscribedElements(this.notSubscribedElements);
    });
  }
  RemoveSubscribtionListener():void{
    this.signalRService.RemoveSubscribtionListener().subscribe((instrument)=>{
      this.DeleteRecord(instrument);
      this.chartDataService.UpdateUnsubscribedElements(this.notSubscribedElements);
    });
  }
  UnsubscribedInstrumentsListener():void{
    this.signalRService.UnsubscribedInstrumentsListener().subscribe((data)=>{
      this.notSubscribedUnfilteredElements=[];
      for (let item of data){
        let tableRecord:SubscribtionTablesItem = {name:item.name, category:item.category,ask:item.ask.toString(),bid:item.bid.toString(),leverage:item.leverage.toString(),waitingResponse:false};
        this.notSubscribedUnfilteredElements.push(tableRecord);
      }          
      this.GetCategories(this.notSubscribedUnfilteredElements);
      this.onSearchInput(this.filter);           
      this.initialWaiting=false;
      this.chartDataService.UpdateUnsubscribedElements(this.notSubscribedElements);
    });
  }
  
  ////////////////////////////////////////////
  GetUnsubscribedItems():void {
    let token = localStorage.getItem("token");
    let sessionID = localStorage.getItem("sessionId");
    if(token&&sessionID)
    {
      let obj:LoginResponseDTO = {token:token,sessionId:sessionID};
      this.signalRService.GetUnsubscribedInstruments(obj);
    }
  }
  SubscribeItem(instrumentName:string):void{
    
    let token = localStorage.getItem("token");
    if(token)
    {
      let instrument:SubscribeRequestDTO={Jwt:token,Instrument:instrumentName};
      this.signalRService.SubscribeInstrument(instrument);
    }
  }
  UnsubscribeItem(instrumentName:string):void{
    let token = localStorage.getItem("token");
    if(token)
    {
      let instrument:SubscribeRequestDTO={Jwt:token,Instrument:instrumentName};
      this.signalRService.UnsubscribeInstrument(instrument);
    }
  }
  UpdateDb():void{
    let token = localStorage.getItem("token");
    let sessionID = localStorage.getItem("sessionId");
    if(token&&sessionID)
    {
      let obj:LoginResponseDTO = {token:token,sessionId:sessionID};
      this.signalRService.UpdateAvalInstrumentsList(obj);
    }    
  }
  /////////////////////////////////////////////

  /////FILTERING AND SORTING///////////
  GetCategories(objects:SubscribeMenuTableRecord[]):void {
    this.categories= Array.from(new Set(objects.map(obj => obj.category)));
  }
  SetCategoryFilter(category:string):void{
    this.filter.Category=category;
    this.currentFilter=category;
    this.onSearchInput(this.filter);
  }
  onSearchInput(filter:FilterCriteria):void {
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

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      this.subscribedFilteredElements = this.subscribedElements;

      if(filter.Name !=="")
      {
        this.subscribedFilteredElements = this.subscribedFilteredElements.filter(item => item.name.toUpperCase().startsWith(this.filter.Name.toUpperCase()));
      }
      if(filter.Category !=="")
      {
        this.subscribedFilteredElements = this.subscribedFilteredElements.filter(item => item.category.toUpperCase() === (this.filter.Category.toUpperCase()));
      }
      if(filter.MinAsk !=="")
      { 
        this.subscribedFilteredElements = this.subscribedFilteredElements.filter(item => parseFloat(item.ask) >= (parseFloat(filter.MinAsk)));
      }
      if(filter.MaxAsk !=="")
      { 
        this.subscribedFilteredElements = this.subscribedFilteredElements.filter(item => parseFloat(item.ask) <= (parseFloat(filter.MaxAsk)));
      }
      if(filter.MinLeverage !=="")
      { 
        this.subscribedFilteredElements = this.subscribedFilteredElements.filter(item => parseFloat(item.leverage) >= (parseFloat(filter.MinLeverage)));
      }
      if(filter.MaxLeverage !=="")
      { 
        this.subscribedFilteredElements = this.subscribedFilteredElements.filter(item => parseFloat(item.leverage) <= (parseFloat(filter.MaxLeverage)));
      }
      this.subscribedFilteredElements = this.subscribedFilteredElements.filter(item => item.name.trim() !== '');
      //////////////////////////////////////////////////////////
      this.UpdateTables();
      
    }
  }
  SortItems(category: string,ascending:boolean):void {
    this.notSubscribedElements = this.notSubscribedElements.filter(item => item.name.trim() !== '');
    this.currentSort=category;
    if(ascending===true)
    {
      this.currentSortOrder="Ascending";
    }
    else
    {
      this.currentSortOrder="Descending";
    }
    switch(category){
      case this.sortingCategories[0]:
        if(ascending===true)
        {
          this.notSubscribedElements.sort((a, b) => {
            const nameComparison = a.name.localeCompare(b.name);
            const categoryComparison = nameComparison === 0 ? a.category.localeCompare(b.category) : nameComparison;
            return categoryComparison === 0 ? a.ask.localeCompare(b.ask) : categoryComparison;
          });
        }
        else
        {
          this.notSubscribedElements.sort((a, b) => {
            const nameComparison = b.name.localeCompare(a.name);
            const categoryComparison = nameComparison === 0 ? b.category.localeCompare(a.category) : nameComparison;
            return categoryComparison === 0 ? b.ask.localeCompare(a.ask) : categoryComparison;
          });
        }
      break;

      case this.sortingCategories[1]:
        if(ascending===true)
        {
          this.notSubscribedElements.sort((a, b) => {          
            const categoryComparison = a.category.localeCompare(b.category);
            const nameComparison = categoryComparison === 0 ? a.name.localeCompare(b.name) : categoryComparison;
            return nameComparison === 0 ? a.ask.localeCompare(b.ask) : nameComparison;
          });
        }
        else
        {
          this.notSubscribedElements.sort((a, b) => {          
            const categoryComparison = b.category.localeCompare(a.category);
            const nameComparison = categoryComparison === 0 ? b.name.localeCompare(a.name) : categoryComparison;
            return nameComparison === 0 ? b.ask.localeCompare(a.ask) : nameComparison;
          });
        }
      break;

      case this.sortingCategories[2]:
        if(ascending===true)
        {
          this.notSubscribedElements.sort((a, b) => {
            const aAsk = parseFloat(a.ask);
            const bAsk = parseFloat(b.ask);

            const askComparison = aAsk - bAsk;
            const nameComparison = askComparison === 0 ? a.name.localeCompare(b.name) : askComparison;
            return nameComparison === 0 ? a.category.localeCompare(b.category) : nameComparison;
          });
        }
        else
        {
          this.notSubscribedElements.sort((a, b) => {          
            const aAsk = parseFloat(a.bid);
            const bAsk = parseFloat(b.bid);
          
            const askComparison = bAsk - aAsk;      
            const nameComparison = askComparison === 0 ? b.name.localeCompare(a.name) : askComparison;
            return nameComparison === 0 ? b.category.localeCompare(a.category) : nameComparison;
          });
        }
      break;

      case this.sortingCategories[3]:
        if(ascending===true)
        {
          this.notSubscribedElements.sort((a, b) => {
            const aBid = parseFloat(a.bid);
            const bBid = parseFloat(b.bid);

            const bidComparison = aBid - bBid;
            const nameComparison = bidComparison === 0 ? a.name.localeCompare(b.name) : bidComparison;
            return nameComparison === 0 ? a.category.localeCompare(b.category) : nameComparison;
          });
        }
        else
        {
          this.notSubscribedElements.sort((a, b) => {
            const aBid = parseFloat(a.bid);
            const bBid = parseFloat(b.bid);
          
            const bidComparison = bBid - aBid;      
            const nameComparison = bidComparison === 0 ? b.name.localeCompare(a.name) : bidComparison;
            return nameComparison === 0 ? b.category.localeCompare(a.category) : nameComparison;
          });
        }
      break;
        
      case this.sortingCategories[4]:
        if(ascending===true)
        {
          this.notSubscribedElements.sort((a, b) => {
            const aLeverage = parseFloat(a.leverage);
            const bLeverage = parseFloat(b.leverage);

            const leverageComparison = aLeverage - bLeverage;
            const nameComparison = leverageComparison === 0 ? a.name.localeCompare(b.name) : leverageComparison;
            return nameComparison === 0 ? a.category.localeCompare(b.category) : nameComparison;
          });
        }
        else
        {
          this.notSubscribedElements.sort((a, b) => {
            const aLeverage = parseFloat(a.leverage);
            const bLeverage = parseFloat(b.leverage);
          
            const leverageComparison = bLeverage - aLeverage;      
            const nameComparison = leverageComparison === 0 ? b.name.localeCompare(a.name) : leverageComparison;
            return nameComparison === 0 ? b.category.localeCompare(a.category) : nameComparison;
          });

        }
      break;
    
      default:
        console.error("error");    
      break;
    }

    this.AddBlankRecords();
  }
  RemoveFilter(){
    this.filter.Category='';
    this.currentFilter="Filter";
    this.onSearchInput(this.filter);
  }
  ////////////////////////////////////
}
