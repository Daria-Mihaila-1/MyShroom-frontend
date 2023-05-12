import {AfterViewInit, Component, Inject, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ImageUploadService} from "../../../services/image-upload.service";
import {PredictionResponse} from "../../../data-type/PredictionResponse";
import {PredictionRequest} from "../../../data-type/PredictionRequest";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {KeyValue} from "@angular/common";
import {MatSidenavContent} from "@angular/material/sidenav";


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

  @ViewChild(MatSidenavContent) matSidenavContent: MatSidenavContent | undefined;
  @ViewChild('sidenav') si: MatSidenavContent | undefined;

  constructor(public dialogRef: MatDialogRef<PredictorDialogComponent>,
              private imageUploadService: ImageUploadService) {

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
    if (this.currentImg) {
      const img: PredictionRequest = {
        base64Img : this.preview
      }
      this.imageUploadService.predict(img).subscribe(
        res => {

          this.prediction = res.scores!
          console.log(this.prediction)
          this.loading = false;
          this.predicted = true;
        },
        err => {
            console.log("Error")
        }
      )
    }

  }



    onRemove(event: any) {
        console.log(this.currentImg)
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


