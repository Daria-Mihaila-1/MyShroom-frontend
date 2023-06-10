import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RegisterUserCredentials} from "../../data-type/RegisterUserCredentials";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {SharedService} from "../../services/shared.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AvatarsDialogComponent} from "./avatars-dialog/avatars-dialog.component";
import {NotificationDialogComponent} from "../notification-dialog/notification-dialog.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public hide:boolean = true;
  msg : string | undefined;

  userCredentialsFormGroup! : FormGroup;
  selectedAvatar : number = -1;

  avatars : string[]
  showDeleteOption: boolean = false;
  constructor(private formBuilder : FormBuilder,
              private router:Router,
              private authService:AuthService,
              private sharedService : SharedService,
              public dialog : MatDialog) {

    let main_dir = "/assets/avatars/"
    this.avatars  = [main_dir + "fairy_.png",
      main_dir + "mushroom_.png",  main_dir + "forager_.png", main_dir + "towering_mushroom_.png"]


  }

  ngOnInit(): void {
    this.userCredentialsFormGroup = this.formBuilder.group({
      firstName: ["",[Validators.required]],
      lastName: ["",[Validators.required]],
      userName: ["",[Validators.required]],
      password: ["",[Validators.required, Validators.pattern(".{8,}")]],

    })

    this.sharedService.currentMessage.subscribe(msg => this.msg = msg);

  }

  registerUser() {
    console.log(this.selectedAvatar)
    if (this.selectedAvatar == -1) {
      this.dialog.open(NotificationDialogComponent, {
        data: {
          notificationMessage: "You must choose an avatar in order to register!",
          notificationTitle: "Registration failed"
        }
      })
    } else {
      console.log(this.selectedAvatar)
      const valuesFromForm = this.userCredentialsFormGroup.value;
      const userCredentials: RegisterUserCredentials = {
        firstName: valuesFromForm.firstName,
        lastName: valuesFromForm.lastName,
        userName: valuesFromForm.userName,
        password: valuesFromForm.password,
        profileImageIndex: this.selectedAvatar
      }

      this.authService.registerUser(userCredentials).subscribe({
        next: response => {
          this.router.navigate(['login'])
          this.setMessage(userCredentials.userName)
        },
        error: err => {
          console.log(err)
        }
      })
    }
  }
  setMessage(messageString : string) {
    this.sharedService.editMessage(messageString)
  }

  openAvatarsDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = "600px";
     dialogConfig.maxWidth = "600px";
     dialogConfig.panelClass = "avatarsDialog"
    dialogConfig.data = this.avatars


    const dialogRef = this.dialog.open(AvatarsDialogComponent, dialogConfig)
    dialogRef.afterClosed().subscribe((selectedAvatar: number) => {
      if (selectedAvatar != -1) {
        this.selectedAvatar = selectedAvatar;
        console.log(selectedAvatar)

      }
    });

  }

  goToLogin() {
    this.router.navigate(['../login']);
  }
}
