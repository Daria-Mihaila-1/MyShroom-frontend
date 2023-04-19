import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {PredictionResponse} from "../data-type/PredictionResponse";
import {PredictionRequest} from "../data-type/PredictionRequest";

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private baseUrl = 'http://localhost:8090/api/classifier';

  constructor(private httpClient: HttpClient) {}

  predict(file: PredictionRequest): Observable<PredictionResponse>{

    file.base64Img = file.base64Img.split(",")[1]

    return this.httpClient.post<PredictionResponse>(this.baseUrl + "/predict",file );
    };
}
