import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "../data-type/Post";
import {Observable} from "rxjs";
import {UploadPost} from "../data-type/UploadPost";
import {UpdatePost} from "../data-type/UpdatePost";

let bodyURL:string = "";
let GET_POSTS: string = ""
let UPLOAD: string = ""
let DELETE: string = ""
let UPDATE: string = ""
let GET_POSTS_NOT_REPORTED_BY_ME : string = ""
let GET_POSTS_TYPES: string = ""
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient:HttpClient) {
    bodyURL = "http://localhost:8090/api/post/"
    GET_POSTS = bodyURL + "get-all"
    GET_POSTS_NOT_REPORTED_BY_ME = bodyURL + "get-posts-not-reported-by/"
    GET_POSTS_TYPES = bodyURL + "get-post-types"
    UPLOAD = bodyURL + "upload"
    DELETE = bodyURL + "delete/"
    UPDATE = bodyURL + "update"
  }

  getAllPosts():Observable<any>{
    return this.httpClient.get(GET_POSTS)
  }

  getPostTypes():Observable<any> {
    return this.httpClient.get(GET_POSTS_TYPES)
  }

  createPost(post : UploadPost ):Observable<Post>{
    return this.httpClient.post<Post>(UPLOAD, post)
  }

  deletePost(id : number): Observable<any> {
    return this.httpClient.delete(DELETE+id);
  }

  updatePost(post : UpdatePost):Observable<Post>{
    return this.httpClient.put<Post>(UPDATE, post)
  }

  getPostsNotReportedByMe() : Observable<Post[]> {
    return this.httpClient.get<Post[]>(GET_POSTS_NOT_REPORTED_BY_ME+ localStorage.getItem('user'));
  }
}
