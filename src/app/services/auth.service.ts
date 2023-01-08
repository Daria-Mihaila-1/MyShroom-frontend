import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginUserCredentials} from "../data-type/LoginUserCredentials";
import {RegisterUserCredentials} from "../data-type/RegisterUserCredentials";
let LOGIN : string;
let REGISTER: string;

let bodyURL:string = "";
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private httpClient : HttpClient) {
    bodyURL = "http://localhost:8090/api"
    LOGIN = bodyURL + "/auth/login"
    REGISTER = bodyURL + "/auth/register"
  }

  loginUser(userCredentials:LoginUserCredentials) {
    localStorage.setItem("userName", userCredentials.userName)

    return this.httpClient.post<any>(LOGIN, userCredentials);
  }


  registerUser(userCredentials: RegisterUserCredentials) {

    return this.httpClient.post<any>(REGISTER, userCredentials);

  }
}
