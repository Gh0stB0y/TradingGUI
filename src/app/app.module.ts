import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './Login/login-component/login-component.component';
import { MainPanelComponent } from './MainPanel/main-panel/main-panel.component';
import { MainWindowComponent } from './MainWindow/main-window/main-window.component';
import { ManageChartsComponent } from './ManageCharts/manage-charts/manage-charts.component';
import { ManageInstrumentsComponent } from './ManageInstruments/manage-instruments/manage-instruments.component';
import { TradingSignalsComponent } from './TradingSignals/trading-signals/trading-signals.component';
import { TransactionsComponent } from './Transactions/transactions/transactions.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgApexchartsModule } from 'ng-apexcharts';

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
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgApexchartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
