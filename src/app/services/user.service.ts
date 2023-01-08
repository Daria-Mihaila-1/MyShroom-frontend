import { Injectable } from '@angular/core';
import {LoginUserCredentials} from "../data-type/LoginUserCredentials";
import {HttpClient} from "@angular/common/http";
let LOGIN : string;

let bodyURL:string = "";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient : HttpClient) {
    bodyURL = "http://localhost:8090/api"
    LOGIN = bodyURL + "/auth/login"
  }

  loginUser(userCredentials:LoginUserCredentials) {
    localStorage.setItem("username", userCredentials.userName)

    return this.httpClient.post<any>(LOGIN, userCredentials);
  }
}
