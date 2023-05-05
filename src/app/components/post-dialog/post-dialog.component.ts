import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Post} from "../../data-type/Post";

@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.css']
})
export class PostDialogComponent implements OnInit{


  constructor(@Inject(MAT_DIALOG_DATA) public data: Post) {
  }

  ngOnInit(): void {
    console.log(this.data)
  }
}
