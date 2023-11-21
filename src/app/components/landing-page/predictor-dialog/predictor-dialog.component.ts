import {AfterViewInit, Component, Inject, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ImageUploadService} from "../../../services/image-upload.service";
import {PredictionResponse} from "../../../data-type/PredictionResponse";
import {PredictionRequest} from "../../../data-type/PredictionRequest";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {KeyValue} from "@angular/common";
import {MatSidenavContent} from "@angular/material/sidenav";
import {MushroomImgService} from "../../../services/mushroom-img.service";
import {map} from "rxjs";
import {MushroomImg} from "../../../data-type/MushroomImg";
import {NotificationDialogComponent} from "../../notification-dialog/notification-dialog.component";


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
  imgsMat : Map<string,Map<string, MushroomImg[]>> = new Map<string, Map<string, MushroomImg[]>>();

  @ViewChild(MatSidenavContent) matSidenavContent: MatSidenavContent | undefined;
  @ViewChild('sidenav') si: MatSidenavContent | undefined;

  constructor(public dialogRef: MatDialogRef<PredictorDialogComponent>,
              public dialog : MatDialog,
              private imageUploadService: ImageUploadService,
              private mushroomImgService : MushroomImgService) {

  }

  ngOnInit(): void {

    let notificationMessage = "This classification system achieves an accuracy of 82%\n Although this percentage seems pretty reliable\n" +
      "!!! We advise you to NOT only rely on our classifier !!!\nwhen deciding whether to ingest or touch a discovered mushroom." +
      "\nBUT we CANNOT ASSURE a 100% correct classification result!\nPLEASE consult other credible sources too, the classifier is for now merely a pointer in the right direction.";
    let notificationTitle = "Classificator Information Note";
    setTimeout(()=> this.dialog.open(NotificationDialogComponent,{data:{
        notificationMessage,
        notificationTitle
      }}),
      150)
  }

  selectFile(event: any): void {
this.predicted = false;
    this.preview = '';


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
              let mushroomTypeMap = new Map<string, MushroomImg[]>();
              mushroomTypeMap.set("nonedible", []);
              mushroomTypeMap.set("edible", []);
                result.forEach(value => {
                  let content_type = "data:image/jpg;base64"
                  value.base64Img = content_type + "," + value.base64Img;
                  if (value.poisonous) {
                    let imgArray = mushroomTypeMap.get("nonedible");
                    if(imgArray) {
                      console.log(value.base64Img.split(",")[0])
                      imgArray.push(value)
                    }
                  }
                  else {
                    let imgArray = mushroomTypeMap.get("edible");
                    if(imgArray) {
                      console.log(value.base64Img.split(",")[0])
                      imgArray.push(value)
                    }
                  }
                })
                this.imgsMat.set(key, mushroomTypeMap)
              }

            )
          )
        },
        err => {
          this.dialog.open(NotificationDialogComponent, {data:{notificationMessage:"Something went wrong...Please try again later", notificationTitle:"Oops!"}})
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


