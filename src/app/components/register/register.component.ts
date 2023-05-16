import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RegisterUserCredentials} from "../../data-type/RegisterUserCredentials";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {SharedService} from "../../services/shared.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AvatarsDialogComponent} from "./avatars-dialog/avatars-dialog.component";

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

  avatars : string[] = ["assets/fairy_PNG96.png", "assets/little_mushroom.png", "assets/little_mushroom_profile_img.png"]

  constructor(private formBuilder : FormBuilder,
              private router:Router,
              private authService:AuthService,
              private sharedService : SharedService,
              public dialog : MatDialog) {

  }

  ngOnInit(): void {
    this.userCredentialsFormGroup = this.formBuilder.group({
      firstName: ["",[Validators.required, Validators.pattern("[A-Z][a-z]*")]],
      lastName: ["",[Validators.required, Validators.pattern("[A-Z][a-z]*")]],
      userName: ["",[Validators.required]],
      password: ["",[Validators.required, Validators.pattern(".{8,}")]],
      avatar:["", Validators.required]
    })

    this.sharedService.currentMessage.subscribe(msg => this.msg = msg);

  }

  registerUser() {
    const valuesFromForm = this.userCredentialsFormGroup.value;
    const userCredentials : RegisterUserCredentials = {
      firstName : valuesFromForm.firstName,
      lastName : valuesFromForm.lastName,
      userName : valuesFromForm.userName,
      password : valuesFromForm.password,
      profileImageIndex:this.selectedAvatar
    }

    this.authService.registerUser(userCredentials).subscribe( {
       next : response =>{
         this.router.navigate(['login'])
         this.setMessage(userCredentials.userName)
      },
      error: err =>  {
         console.log(err)
      }
    })
  }

  setMessage(messageString : string) {
    this.sharedService.editMessage(messageString)
  }

  openAvatarsDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = "600px";
    // dialogConfig.maxHeight = "600px";


    const dialogRef = this.dialog.open(AvatarsDialogComponent, dialogConfig)
    dialogRef.afterClosed().subscribe((selectedAvatar: number) => {
      if (selectedAvatar) {
        this.selectedAvatar = selectedAvatar;
        console.log(selectedAvatar)
        console.log(selectedAvatar)
        this.userCredentialsFormGroup.get('avatar')!.setValue(this.avatars![selectedAvatar].split("/")[1].split(".")[0]);
      }
    });

  }
}
