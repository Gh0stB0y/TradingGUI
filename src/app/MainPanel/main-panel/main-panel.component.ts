import { Component } from '@angular/core';

@Component({
  selector: 'app-main-panel',
  templateUrl:'./main-panel.component.html',
  styleUrls: ['./main-panel.component.scss',
              "../../../../css/main.min.css"]
})
export class MainPanelComponent {
 

  elements = ['OIL.WTI', 'EURUSD', 'EURPLN', 'USDPLN', 'WIG20'];
  intervals =['M1', 'M5', 'M15', 'H1', 'H4', 'D1', 'W1'];
  tradeSignals =['trade1','trade1','trade1','trade1','trade1'];

  condition:string='case4';
  check:boolean=false;
}
