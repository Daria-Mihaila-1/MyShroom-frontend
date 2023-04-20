import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginUserCredentials} from "../data-type/LoginUserCredentials";
import {RegisterUserCredentials} from "../data-type/RegisterUserCredentials";
import {Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";
let LOGIN : string;
let REGISTER: string;
let SIGNOUT: string;

let bodyURL:string = "";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
   httpOptions = {
    observe: 'response' as 'response',
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient : HttpClient,
  ) {
    bodyURL = "http://localhost:8090/api"
    LOGIN = bodyURL + "/auth/login"
    REGISTER = bodyURL + "/auth/register"
    SIGNOUT = bodyURL + "/auth/logout"
  }

  loginUser(userCredentials:LoginUserCredentials):Observable<any> {

    localStorage.setItem("userName", userCredentials.userName)
    //TODO: cu httpOptions sa faci si la register si la signout

    return this.httpClient.post<any>(LOGIN, userCredentials, this.httpOptions);
  }


  registerUser(userCredentials: RegisterUserCredentials) {

    return this.httpClient.post<any>(REGISTER, userCredentials, this.httpOptions);

  }
  signOutUser():any{
    return this.httpClient.post(SIGNOUT, {}, this.httpOptions);
  }
}
