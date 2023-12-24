import { Component } from '@angular/core'
import { LoginCredsDTO } from 'src/Models/LoginCredsDTO';
import { ErrorResponseDTO } from 'src/Models/ErrorResponseDTO';
import { NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpServicesService } from 'src/app/Services/http-services.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { LoginResponseDTO } from 'src/Models/LoginResponseDTO';
@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.scss',
                "../../../../css/main.min.css"]
})
export class LoginComponentComponent implements OnInit {
  constructor(private httpService:HttpServicesService, private router:Router) {}
  ErrorMsg:string="";
  InitialErrorMessage:string="";
  
  LoginData:LoginCredsDTO=
  {
    Id:'',
    Password:'',
    RealAccount:true
  }
  RememberMe: boolean = false;
  WaitingForResponse: boolean = false;
  InitialWaiting: boolean =true;

  ngOnInit(): void {
    const SessionId = localStorage.getItem("sessionId");
    const Token = localStorage.getItem("token");

    if(SessionId && Token)
    {
      const data:LoginResponseDTO = {
        sessionId: SessionId.toString(),
        token: Token.toString()
      }
      this.httpService.CheckSession(data)
      .subscribe
      ({
        next: (returnData)=>{
          this.InitialWaiting = false;
          localStorage.setItem("sessionId",returnData.sessionId);
          localStorage.setItem("token", returnData.token);
          this.router.navigate(['Panel']);
        },
        error:(err) =>{
          this.InitialWaiting = false;
          this.InitialErrorMessage = err.error;
          console.error(err.error);
        }
      });
    }
    else
    {
      this.InitialWaiting = false;
    }
  }

  Login()
  {
    this.WaitingForResponse=true;
    this.ErrorMsg="";
    this.httpService.LoginRequest(this.LoginData)
    .subscribe
    ({
      next:(returnData)=>
      {
        localStorage.setItem("sessionId",returnData.sessionId);
        localStorage.setItem("token", returnData.token);
        localStorage.setItem("accountId",this.LoginData.Id);
        this.WaitingForResponse=false;
        this.router.navigate(['Panel']);
      },
      error:(err)=>
      {
        this.WaitingForResponse=false;

        if (err.status === 0) 
        {
          this.ErrorMsg='ERROR: Connection refused. Please check your internet connection or try again later.';
        }
        else
        {
          try{
            const errorMessage = err.error.split('\n')[0];
            console.log(err.error);
            this.ErrorMsg=errorMessage;
          }
          catch{
            console.log(err.error);
            this.ErrorMsg="Error! Please, check the console";
          }
        } 
      }
    })
  }
  AccountType(type:boolean)
  {
    this.LoginData.RealAccount=type;
  }

}
