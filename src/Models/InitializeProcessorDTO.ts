export class InitializeProcessorDTO{
    Instruments:string[] = [];
    option:number = 0;

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

    checkingDuration:number = 0;
    riskAssessment:number = 0;
    minPipsIncome:number = 0;
    desiredPipsIncome:number = 0;
    stopLossPips:number = 0;
}