import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PredictorDialogComponent} from "./predictor-dialog/predictor-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {PostService} from "../../services/post.service";
import {Post} from "../../data-type/Post";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import { HostListener } from "@angular/core";
import {CookieService} from "ngx-cookie-service";
import {MapDialogComponent} from "./map-dialog/map-dialog.component";
import {Marker} from "../../data-type/Marker";
const iconBase =
  "https://developers.google.com/maps/documentation/javascript/examples/full/images/";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})


export class LandingPageComponent implements OnInit {
  height : number = 0;
  width: number = window.innerWidth;
  map: google.maps.Map | undefined;
  lat = 45.84390812570921
  lng = 24.971530777243718
  center = new google.maps.LatLng(this.lat,this.lng)
  zoom = 6.5
  ROMANIA_BOUNDS = {
    north: 48.46723046062661,
    south: 43.306942557261806,
    west: 19.987220959549834,
    east: 30.00675167516294,
  };
  posts: Post[] = [];
  markers : Marker[] =[];
  marker_icons:string[] = [];
  myOptions: google.maps.MapOptions = {
    center :{lat:this.lat,lng:this.lng},
    zoom : this.zoom,
    restriction:{latLngBounds:this.ROMANIA_BOUNDS,  strictBounds: false},
    fullscreenControl:false,

  };


  constructor(private dialog : MatDialog,
              private postService: PostService,
              private authService : AuthService,
              private router : Router,
              private cookieService: CookieService) {

  }


  ngOnInit(): void {
      this.postService.getAllPosts().subscribe(data => {
      this.posts = data;

      this.markers = this.posts.map((el => ({ lat: el.latitude, lng: el.longitude, type:el.type})));


        for (let i = 0; i < this.markers.length; i++){
        if (this.markers[i].type == "INFO"){
          this.markers[i].type = iconBase + "/.png"
        }
        else if(this.markers[i].type == "BEAR_ALERT"){
          this.markers[i].type = iconBase + "/bear.png"
        }
        else if(this.markers[i].type == "POISONOUS"){
          this.markers[i].type = iconBase + "/alert.png"
        }
      }

      },
      err => {
        this.router.navigate(['../login'])
        localStorage.setItem("tokenStatus", "isExpired")
      })
    console.log("inside landing page" + this.parseJwt(this.cookieService.get("token"))['id'])
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.width = (event.target as Window).innerWidth;
    this.height = (event.target as Window).innerHeight;
  }

  openMapDialog() :void {
    const dialogRef = this.dialog.open(MapDialogComponent, {
      data: {markers:this.markers,posts:this.posts}
    });

  }
  openPredictWindow(): void {
    console.log(this.posts)
    const dialogRef = this.dialog.open(PredictorDialogComponent, {
    data: {img:"ceva random boss"}
  });


    dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');

  });
}

  signOut() {
    this.authService.signOutUser();
    this.router.navigate(['../login'])
    this.cookieService.set("token","")
    console.log(this.cookieService.get("token"))
  }

  private parseJwt(token: string): any {
    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString());
  }

}

