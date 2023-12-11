import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './Login/login-component/login-component.component';
import { MainPanelComponent } from './MainPanel/main-panel/main-panel.component';
import { MainWindowComponent } from './MainWindow/main-window/main-window.component';

const routes: Routes = [

  {path:'', component: LoginComponentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
