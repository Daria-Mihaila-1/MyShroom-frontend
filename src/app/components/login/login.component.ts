import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {LoginUserCredentials} from "../../data-type/LoginUserCredentials";
import {AuthService} from "../../services/auth.service";
import {SharedService} from "../../services/shared.service";
import {CookieService} from "ngx-cookie-service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  msg! : string;
  tokenMsg: string|undefined;

  userCredentialsFormGroup = this.formBuilder.group({
    username: ["",[Validators.required, Validators.nullValidator]] ,
    password: ["",[Validators.required]],
  })
  public hide:boolean = true;
  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sharedService : SharedService,
    private cookieService : CookieService

  ) { }

  ngOnInit(): void {
    this.sharedService.currentMessage.subscribe(msg => this.msg = msg);

    if (this.msg != "default message") {
      this.userCredentialsFormGroup.setValue({username:this.msg,
      password: ""})
      this.sharedService.editMessage("default message")
    }

    if (localStorage.getItem("tokenStatus")){
      if (localStorage.getItem("tokenStatus") === "isExpired"){
        this.snackBar.open("Your session has expired.\n Please log in again!", "Ok",{duration: 300});
      }

    }
  }

  public loginUser() {
    const valuesFromForm = this.userCredentialsFormGroup.value;
    const userCredentials: LoginUserCredentials = {
      userName: valuesFromForm.username!,
      password: valuesFromForm.password!,
    };
    // @ts-ignore
      this.authService.loginUser(userCredentials).subscribe({
        next: response => {

          const parsedJWT = this.parseJwt(response.body['token']);

          localStorage.setItem("role",parsedJWT['roles'])
          localStorage.setItem("user",parsedJWT['id'])


          if (parsedJWT['role'].includes("USER")) {

            this.cookieService.set("token", response.body['token'])

            this.router.navigate(['../landing-page'])
          }
        },
        error: err => {
          //TODO:Error dialog box
          console.log(err)
    }
  });

  }

   private parseJwt(token: string): any {
    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString());
  }

  goToRegister() {
    this.router.navigate(['../register'])
  }


}
