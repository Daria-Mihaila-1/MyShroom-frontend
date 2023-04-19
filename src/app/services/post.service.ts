import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "../data-type/Post";
import {Observable} from "rxjs";

let bodyURL:string = "";
let GET_POSTS: string = ""
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient:HttpClient) {
    bodyURL = "http://localhost:8090/api/post/"
    GET_POSTS = bodyURL + "get-all"
  }

  getAllPosts():Observable<any>{
    return this.httpClient.get(GET_POSTS)
  }

}
