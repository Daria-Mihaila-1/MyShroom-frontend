import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css']
})
export class MapDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MapDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: string,) { }

  ngOnInit(): void {
  }

}
