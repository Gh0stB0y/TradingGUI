import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginCredsDTO } from 'src/Models/LoginCredsDTO';

@Injectable({
  providedIn: 'root'
})
export class HttpServicesService {
  
  private apiUrl = 'https://localhost:7077';

  constructor(private http: HttpClient) { }


  LoginRequest(data: LoginCredsDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Trading/Login`, data);
  }



}
