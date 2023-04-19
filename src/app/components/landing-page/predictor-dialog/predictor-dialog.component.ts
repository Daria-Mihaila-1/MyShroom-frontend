import {Component, Inject, OnInit} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ImageUploadService} from "../../../services/image-upload.service";
import {PredictionResponse} from "../../../data-type/PredictionResponse";
import {PredictionRequest} from "../../../data-type/PredictionRequest";
import {CdkDragDrop} from "@angular/cdk/drag-drop";


@Component({
  selector: 'app-predictor-dialog',
  templateUrl: './predictor-dialog.component.html',
  styleUrls: ['./predictor-dialog.component.css']
})
export class PredictorDialogComponent implements OnInit {

  currentImg? : File;
  preview :string = '';
  prediction : Map<string, number> = new Map<string, number>();

  constructor(public dialogRef: MatDialogRef<PredictorDialogComponent>,
              private imageUploadService: ImageUploadService) { }

  ngOnInit(): void {

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  selectFile(event: any): void {

    this.preview = '';
    console.log("la inceput de selectFile")
    console.log(event)

    this.currentImg = event.addedFiles[0];

    if (this.currentImg) {
      console.log("acuma vedem fisieru daca e null")
      const file: File = this.currentImg;
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
    if (this.currentImg) {

      const img: PredictionRequest = {
        base64Img : this.preview
      }

      this.imageUploadService.predict(img).subscribe(
        res => {
          console.log(res)
          this.prediction = res.prediction;
        },
        err => {
            console.log("nu am mers boss ce sa faci")
        }
      )
    }
  }



    onRemove(event: any) {
      console.log(event);
       this.currentImg = undefined;
       this.preview = ''
    }


}
