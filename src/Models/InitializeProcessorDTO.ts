export class InitializeProcessorDTO{
    Instruments:string[] = [];
    option:number = 0;

    longTrendMaxHours:number = 0;
    midTrendMaxHours:number = 0;
    shortTrendMaxHours:number = 0;

    longTrendMinHours:number = 0;
    midTrendMinHours:number = 0;
    shortTrendMinHours:number = 0;

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