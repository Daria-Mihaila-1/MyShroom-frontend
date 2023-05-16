import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import { MatIconRegistry } from "@angular/material/icon";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import {RouterModule} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import {PredictorDialogComponent} from "./components/landing-page/predictor-dialog/predictor-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDialogConfig} from "@angular/material/dialog";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NgxDropzoneModule} from "ngx-dropzone";
import {AuthentificationInterceptor} from "./services/authentification.interceptor";
import {GoogleMapsModule} from "@angular/google-maps";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import { AngularResizeEventModule } from 'angular-resize-event';
import { PostComponent } from './components/landing-page/post/post.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatListModule} from "@angular/material/list";
import {MatTableModule} from "@angular/material/table";
import {MatMenuModule} from "@angular/material/menu";
import { MapDialogComponent } from './components/landing-page/map-dialog/map-dialog.component';
import { MapComponent } from './components/map/map.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {PostDialogComponent} from "./components/post-dialog/post-dialog.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTabsModule} from "@angular/material/tabs";
import { CreatePostComponent } from './components/create-post/create-post.component';
import {MatSelectModule} from "@angular/material/select";
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { NotificationDialogComponent } from './components/notification-dialog/notification-dialog.component';
import {ProfilePageComponent} from "./components/profile-page/profile-page.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MaterialFileInputModule} from "ngx-material-file-input";
import { AvatarsDialogComponent } from './components/register/avatars-dialog/avatars-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LandingPageComponent,
    PredictorDialogComponent,
    PostComponent,
    MapDialogComponent,
    MapComponent,
    PostDialogComponent,
    CreatePostComponent,
    ConfirmationDialogComponent,
    NotificationDialogComponent,
    ProfilePageComponent,
    AvatarsDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    DragDropModule,
    NgxDropzoneModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBak_6U11rtcHdBW6x7k3XHbCT5Kl8bYWc'
    // }),
    GoogleMapsModule,
    MatCardModule,
    MatGridListModule,
    AngularResizeEventModule,
    MatChipsModule,
    MatSnackBarModule,
    MatListModule,
    MatTableModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatSidenavModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressBarModule,
    MatTooltipModule,
    MaterialFileInputModule

  ],
  exports: [RouterModule],
  providers: [MatDialogConfig,
    { provide: HTTP_INTERCEPTORS, useClass: AuthentificationInterceptor, multi: true }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
