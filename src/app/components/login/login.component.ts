import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {LoginUserCredentials} from "../../data-type/LoginUserCredentials";
import {AuthService} from "../../services/auth.service";
import {SharedService} from "../../services/shared.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  msg! : string;

  userCredentialsFormGroup = this.formBuilder.group({
    username: ["",[Validators.required, Validators.nullValidator]] ,
    password: ["",[Validators.required]],
  })
  public hide:boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sharedService : SharedService

  ) { }

  ngOnInit(): void {
    this.sharedService.currentMessage.subscribe(msg => this.msg = msg);

    if (this.msg != "default message") {
      this.userCredentialsFormGroup.setValue({username:this.msg,
      password: ""})
      this.sharedService.editMessage("default message")
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
          const parsedJWT = this.parseJwt(response['token']);
          localStorage.setItem("role",parsedJWT['roles'])

          console.log(parsedJWT['role'])
          if (parsedJWT['role'].includes("USER")) {
          //TODO: da-i acces la tot la ce ar avea acces un user
            this.router.navigate(['../landing_page'])
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
     console.log(window.atob(base64Url))
    const base64: string = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString());
  }

  goToRegister() {
    this.router.navigate(['../register'])
  }
}
