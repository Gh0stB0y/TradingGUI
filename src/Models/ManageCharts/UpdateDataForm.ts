export interface UpdateDataForm{
    Instrument:string;
    Interval:string;
    
    Alldata:boolean;
    
    SearchInterval:string;
    SearchNumber:number;

    candlesNumber:number;
}