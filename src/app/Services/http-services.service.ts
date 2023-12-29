import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginCredsDTO } from 'src/Models/LoginCredsDTO';
import { LoginResponseDTO } from 'src/Models/LoginResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class HttpServicesService {
  
  private apiUrl = 'https://localhost:7077';

  constructor(private http: HttpClient) { }


  LoginRequest(data: LoginCredsDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.apiUrl}/Trading/Login`, data);
  }
  CheckSession(data:LoginResponseDTO): Observable<LoginResponseDTO>{
    return this.http.put<LoginResponseDTO>(`${this.apiUrl}/Trading/CheckSession`, data);
  }
  LogoutRequest(data: LoginResponseDTO) : Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Trading/Logout`,data);
  }

 
}
