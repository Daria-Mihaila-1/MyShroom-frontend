import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {RouterModule, Routes} from "@angular/router";
import {LandingPageComponent} from "./components/landing-page/landing-page.component";
import {AuthguardService} from "./services/authguard.service";

const routes: Routes =  [
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'landing-page', component:LandingPageComponent,canActivate:[AuthguardService]},
  {path:"**", redirectTo:'login'}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
