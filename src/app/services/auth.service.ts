import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginUserCredentials} from "../data-type/LoginUserCredentials";
import {RegisterUserCredentials} from "../data-type/RegisterUserCredentials";
import {Observable} from "rxjs";
let LOGIN : string;
let REGISTER: string;
let SIGNOUT: string;

let bodyURL:string = "";
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private httpClient : HttpClient) {
    bodyURL = "http://localhost:8090/api"
    LOGIN = bodyURL + "/auth/login"
    REGISTER = bodyURL + "/auth/register"
    REGISTER = bodyURL + "/auth/logout"
  }

  loginUser(userCredentials:LoginUserCredentials):Observable<any> {
    const httpOptions = {
      observe: 'response' as 'response',
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    localStorage.setItem("userName", userCredentials.userName)
    //TODO: cu httpOptions sa faci si la register si la signout
    console.log("httpOptions headers:")
    console.log(httpOptions.headers)
    return this.httpClient.post<any>(LOGIN, userCredentials, httpOptions);
  }


  registerUser(userCredentials: RegisterUserCredentials) {

    return this.httpClient.post<any>(REGISTER, userCredentials);

  }
  signOutUser() {
    return this.httpClient.get<any>(SIGNOUT);
  }
}
