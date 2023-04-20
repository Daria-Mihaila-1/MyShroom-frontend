import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RegisterUserCredentials} from "../../data-type/RegisterUserCredentials";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {SharedService} from "../../services/shared.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public hide:boolean = true;
  msg : string | undefined;

  userCredentialsFormGroup! : FormGroup;


  constructor(private formBuilder : FormBuilder,
              private router:Router,
              private authService:AuthService,
              private sharedService : SharedService) {
  }

  ngOnInit(): void {
    this.userCredentialsFormGroup = this.formBuilder.group({
      firstName: ["",[Validators.required, Validators.pattern("[A-Z][a-z]*")]],
      lastName: ["",[Validators.required, Validators.pattern("[A-Z][a-z]*")]],
      userName: ["",[Validators.required]],
      password: ["",[Validators.required, Validators.pattern("[a-z0-9]+")]],
    })

    this.sharedService.currentMessage.subscribe(msg => this.msg = msg);

  }

  registerUser() {
    const valuesFromForm = this.userCredentialsFormGroup.value;
    const userCredentials : RegisterUserCredentials = {
      firstName : valuesFromForm.firstName,
      lastName : valuesFromForm.lastName,
      userName : valuesFromForm.userName,
      password : valuesFromForm.password
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
}
