import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
import {MapComponent} from "../map/map.component";
import {CreatePostComponent} from "../create-post/create-post.component";
const iconBase =
  "https://developers.google.com/maps/documentation/javascript/examples/full/images/";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})


export class LandingPageComponent implements OnInit, OnChanges, AfterViewInit {
  height : number = 0;
  width: number = window.innerWidth;


  @ViewChild('mapContainer',  { read: ElementRef }) mapContainer : ElementRef | undefined;

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

      this.postService.getPostsNotReportedByMe().subscribe(data => {
      this.posts = data.reverse();
      console.log(data)
      this.markers = this.posts.map((el => ({ lat: el.latitude, lng: el.longitude, type:el.type})));

        //TODO: fa markerele pe tipuri
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
        console.log("token probably expired")
        this.router.navigate(['../login'])
        console.log("token probably expired")
        localStorage.setItem("tokenStatus", "isExpired")
      })
    console.log("inside landing page" + this.parseJwt(this.cookieService.get("token"))['id'])
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.width = (event.target as Window).innerWidth;

  }

  openMapDialog() :void {
    const dialogRef = this.dialog.open(MapDialogComponent, {
      data: {markers:this.markers,posts:this.posts},
    })
  }
  openPredictWindow(): void {

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
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  private parseJwt(token: string): any {
    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString());
  }

  openCreatePost() {
    let dialogRef = this.dialog.open(CreatePostComponent)

    dialogRef.afterClosed().subscribe( result =>
    {
      this.postService.getPostsNotReportedByMe().subscribe(data =>
      {
        this.posts = data.reverse();
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
          console.log("token probably expired")
          this.router.navigate(['../login'])
          console.log("token probably expired")
          localStorage.setItem("tokenStatus", "isExpired")
        })
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
  }



  ngAfterViewInit(): void {
    this.height = this.mapContainer?.nativeElement.offsetHeight;
    console.log(this.height)
  }

  getPostIndex(post : Post) {
    let index = 0
    while (this.posts[index].id != post.id) index++;
    return index;
  }
  deletePost($event: number) {

    this.postService.deletePost($event).subscribe( data => {
      console.log("deleted post " + $event)
      console.log(data)
      let deletedPostIndex =this.getPostIndex(data)
      if (deletedPostIndex < this.posts.length) {
        this.posts.splice(deletedPostIndex, 1)
      }
    })
  }

  refreshList($event: Post[] | void) {
    console.log($event)
    window.location.reload();
  }
}

