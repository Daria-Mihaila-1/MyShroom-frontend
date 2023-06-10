import { Injectable } from '@angular/core';
import {LoginUserCredentials} from "../data-type/LoginUserCredentials";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../data-type/User";
import {ReportPost} from "../data-type/ReportPost";
import {Post} from "../data-type/Post";

let REPORT : string;
let GET_USER_BY_ID : string;
let DELETE : string;
let bodyURL:string = "";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient : HttpClient) {
    bodyURL = "http://localhost:8090/api/user/"

    REPORT = bodyURL + "report"
    GET_USER_BY_ID = bodyURL + "get-user-by-id/"
    DELETE = bodyURL + "delete/"

  }

  report(reportPost : ReportPost):Observable<Post[]> {
    // @ts-ignore
    return this.httpClient.put<User>(REPORT,reportPost)
  }

  getUserById(id : number) : Observable<any> {
    return this.httpClient.get(GET_USER_BY_ID + id);
  }

  delete() :Observable<User> {
    return this.httpClient.delete<User>(DELETE + localStorage.getItem('user'))
  }
}
