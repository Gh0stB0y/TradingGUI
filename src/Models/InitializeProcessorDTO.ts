export class InitializeProcessorDTO{
    Instruments:string[] = [];

    longTrendMaxDays:number = 0;
    midTrendMaxDays:number = 0;
    shortTrendMaxDays:number = 0;

    longTrendMinDays:number = 0;
    midTrendMinDays:number = 0;
    shortTrendMinDays:number = 0;

    longTrendMinCandles:number = 0;
    midTrendMinCandles:number = 0;
    shortTrendMinCandles:number = 0;

    longTrendMaxCandles:number = 0;
    midTrendMaxCandles:number = 0;
    shortTrendMaxCandles:number = 0;

    option:number = 0;
}