import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.css']
})
export class NotificationDialogComponent {

constructor(@Inject(MAT_DIALOG_DATA) public data :{notificationMessage: string, notificationTitle:string} ,
            public dialogRef : MatDialogRef<NotificationDialogComponent>,) {
}
}
