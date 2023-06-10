import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {MushroomImg} from "../data-type/MushroomImg";
let GET_IMAGES_BY_TYPE = ""
let bodyURL = ""
@Injectable({
  providedIn: 'root'
})


export class MushroomImgService {

  constructor(private httpClient: HttpClient) {
    bodyURL = "http://localhost:8090/api/mushroom-img/"
    GET_IMAGES_BY_TYPE = bodyURL + "get-all-by-mushroomType/"
  }

  getMushroomsByGenus(mushroomType : string):Observable<MushroomImg[]> {
    return this.httpClient.get<MushroomImg[]>(GET_IMAGES_BY_TYPE + mushroomType)
  }
}
