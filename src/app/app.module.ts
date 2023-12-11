import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './Login/login-component/login-component.component';
import { MainPanelComponent } from './MainPanel/main-panel/main-panel.component';
import { MainWindowComponent } from './MainWindow/main-window/main-window.component';
import { ManageChartsComponent } from './ManageCharts/manage-charts/manage-charts.component';
import { ManageInstrumentsComponent } from './ManageInstruments/manage-instruments/manage-instruments.component';
import { TradingSignalsComponent } from './TradingSignals/trading-signals/trading-signals.component';
import { TransactionsComponent } from './Transactions/transactions/transactions.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    MainPanelComponent,
    MainWindowComponent,
    ManageChartsComponent,
    ManageInstrumentsComponent,
    TradingSignalsComponent,
    TransactionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
