import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  constructor(public dialog : MatDialog, public dialogRef : MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public confirmationMessage : string ) { }

  ngOnInit(): void {

  }

  onNoClick(){
    this.dialogRef.close(false)
  }

  onYesClick()
  {
    this.dialogRef.close(true);
  }

}
