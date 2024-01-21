import { interval } from "rxjs";

export class ChartRecord{
    name: string;
    interval:string;
    data:(number | number[])[][];
}

// export let chartData:ChartRecord[]= [
//     {
//         name:"cjik",
//         data:
//         [
//             [123123,[123123,123123,123123,123123]],
//             [123123,[123123,123123,123123,123123]],
//             [123123,[123123,123123,123123,123123]],
//             [123123,[123123,123123,123123,123123]],
//             [123123,[123123,123123,123123,123123]],
//         ]
//     },
//     {
//         name:"dupa",
//         data:
//         [
//             [1256423,[3451234,123354,546123,1234345]],
//             [1256423,[3451234,123354,546123,1234345]],
//             [1256423,[3451234,123354,546123,1234345]],
//             [1256423,[3451234,123354,546123,1234345]],
//             [1256423,[3451234,123354,546123,1234345]]
//         ]
//     }
// ];


