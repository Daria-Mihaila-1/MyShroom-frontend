import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NotificationDialogComponent} from "../../notification-dialog/notification-dialog.component";
import {Post} from "../../../data-type/Post";

@Component({
  selector: 'app-avatars-dialog',
  templateUrl: './avatars-dialog.component.html',
  styleUrls: ['./avatars-dialog.component.css']
})
export class AvatarsDialogComponent implements OnInit{
  avatars : string[] = []
  selectedAvatar : number = -1;
  constructor(  public dialogRef: MatDialogRef<AvatarsDialogComponent>,
                public dialog : MatDialog, @Inject(MAT_DIALOG_DATA) public data: string[] )
  {
      this.avatars = data
  }

  ngOnInit(): void {


  }

  selectAvatar(avatar: number) {
    this.selectedAvatar = avatar
    console.log("lam selectat mama lui", this.selectedAvatar)
  }

  confirmSelection() {
    console.log(this.selectedAvatar)
    if (this.selectedAvatar == -1){
      this.dialog.open(NotificationDialogComponent,
        {data: {notificationMessage:"Please choose an avatar to continue!", notificationTitle:"No Avatar chosen"}})

    }
    else{this.dialogRef.close(this.selectedAvatar)}

  }
}
