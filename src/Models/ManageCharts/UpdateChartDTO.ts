export interface UpdateChartDTO{
    name:string;
    interval:string;
    data:MyChartData[];
}
class MyChartData{
    time:number;
    data:number[];
}