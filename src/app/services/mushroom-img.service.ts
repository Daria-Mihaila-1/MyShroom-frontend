import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {MushroomImg} from "../data-type/MushroomImg";
import {AddMushroomImg} from "../data-type/AddMushroomImg";
let GET_IMAGES_BY_TYPE = ""
let ADD_IMG = ""
let bodyURL = ""
@Injectable({
  providedIn: 'root'
})


export class MushroomImgService {

  constructor(private httpClient: HttpClient) {
    bodyURL = "http://localhost:8090/api/mushroom-img/"
    GET_IMAGES_BY_TYPE = bodyURL + "get-all-by-mushroomType/"
    ADD_IMG = bodyURL + "add-img"
  }

  addImg(mushroomImg: AddMushroomImg) : Observable<any> {
    mushroomImg.base64Img = mushroomImg.base64Img.split(",")[1];
    console.log(mushroomImg.base64Img)
    return this.httpClient.post(ADD_IMG, mushroomImg);
  }
  getMushroomsByGenus(mushroomType : string):Observable<MushroomImg[]> {
    return this.httpClient.get<MushroomImg[]>(GET_IMAGES_BY_TYPE + mushroomType)
  }
}
