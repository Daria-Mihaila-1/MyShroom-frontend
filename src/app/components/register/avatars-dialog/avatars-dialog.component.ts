import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-avatars-dialog',
  templateUrl: './avatars-dialog.component.html',
  styleUrls: ['./avatars-dialog.component.css']
})
export class AvatarsDialogComponent implements OnInit{
  avatars : string[] = []
  selectedAvatar : number = -1;
  constructor(  public dialogRef: MatDialogRef<AvatarsDialogComponent>) {
  this.avatars  = ["/assets/fairy_PNG96.png", "/assets/little_mushroom.png", "/assets/little_mushroom_profile_img.png"]
  }

  ngOnInit(): void {
    this.avatars  = ["/assets/fairy_PNG96.png", "/assets/smiley_mushroom.png", "/assets/little_mushroom_profile_img.png",
      "/assets/smiley_mushroom.png"]

  }

  selectAvatar(avatar: number) {
    this.selectedAvatar = avatar
    console.log("lam selectat mama lui", this.selectedAvatar)
  }

  confirmSelection() {
    this.dialogRef.close(this.selectedAvatar)
  }
}
