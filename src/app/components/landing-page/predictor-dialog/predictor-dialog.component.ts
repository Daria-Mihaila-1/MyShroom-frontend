import {AfterViewInit, Component, Inject, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ImageUploadService} from "../../../services/image-upload.service";
import {PredictionResponse} from "../../../data-type/PredictionResponse";
import {PredictionRequest} from "../../../data-type/PredictionRequest";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {KeyValue} from "@angular/common";
import {MatSidenavContent} from "@angular/material/sidenav";
import {MushroomImgService} from "../../../services/mushroom-img.service";
import {map} from "rxjs";
import {MushroomImg} from "../../../data-type/MushroomImg";


@Component({
  selector: 'app-predictor-dialog',
  templateUrl: './predictor-dialog.component.html',
  styleUrls: ['./predictor-dialog.component.css']
})
export class PredictorDialogComponent implements OnInit, AfterViewInit {

  currentImg? : File;
  preview :string = '';
  prediction : Map<string, number> = new Map<string, number>();
  loading : boolean = false;
  predicted = false;
  imgsMat : Map<string,MushroomImg[]> = new Map<string, MushroomImg[]>();

  @ViewChild(MatSidenavContent) matSidenavContent: MatSidenavContent | undefined;
  @ViewChild('sidenav') si: MatSidenavContent | undefined;

  constructor(public dialogRef: MatDialogRef<PredictorDialogComponent>,
              private imageUploadService: ImageUploadService,
              private mushroomImgService : MushroomImgService) {

  }

  ngOnInit(): void {
    console.log(this.prediction)
  }

  selectFile(event: any): void {
this.predicted = false;
    this.preview = '';
    console.log("la inceput de selectFile")


    this.currentImg = event.addedFiles[0];

    if (this.currentImg) {


      this.preview = '';

      const reader = new FileReader();

      reader.onload = (e: any) => {

        //will be base64 encoded string of File object
        this.preview = e.target.result;
      };
      reader.readAsDataURL(this.currentImg);
    }
  }


  predict() : void {
    this.loading = true;

    function reformatPrediction(prediction: Map<string, number>) {
      prediction.forEach((value, key) => {
        prediction.set(key,Math.floor(value * Math.pow(10, 2)) / Math.pow(10, 2)*100);
      });
    }

    if (this.currentImg) {
      const img: PredictionRequest = {
        base64Img : this.preview
      }
      this.imageUploadService.predict(img).subscribe(
        res => {

          this.prediction  = new Map(Object.entries(res.scores!));

          reformatPrediction(this.prediction)
          this.loading = false;
          this.predicted = true;
          let i = 0
          this.prediction.forEach((value:number, key:string) =>

            this.mushroomImgService.getMushroomsByGenus(key).subscribe( result=>
            {
              console.log(result)

                result.forEach(value => {
                  let content_type = "data:image/jpg;base64"
                  value.base64Img = content_type + "," + value.base64Img;
                })
                this.imgsMat.set(key, result)
              }

            )
          )
        },
        err => {
            console.log("Error")
        }
      )

    }

  }


    onRemove(event: any) {
       this.currentImg = undefined;
       this.preview = ''
      this.prediction = new Map<string, number>();
       this.predicted = false


  }
  mySortingFunction  = (a: KeyValue<string, number>, b: KeyValue<string, number>) => {
    return a.value > b.value ? -1 : 1;
  }

  ngAfterViewInit(): void {
    this.matSidenavContent?.elementScrolled( )
  }


}


