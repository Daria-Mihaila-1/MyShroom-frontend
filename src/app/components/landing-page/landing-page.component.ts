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
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PostService} from "../../services/post.service";
import {Post} from "../../data-type/Post";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import { HostListener } from "@angular/core";
import {CookieService} from "ngx-cookie-service";
import {MapDialogComponent} from "./map-dialog/map-dialog.component";
import {Marker} from "../../data-type/Marker";
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
              private cookieService: CookieService,

  ) {

  }

  ngOnInit(): void {

    this.postService.getPostsNotReportedByMe().subscribe(data => {
      this.posts = data.reverse();
        this.markers = this.posts.map((el => ({ lat: el.latitude, lng: el.longitude, type:el.type})));

        for (let i = 0; i < this.posts.length; i++){
          if (this.posts[i].type == "INFO"){
            this.markers[i].type = "assets/green_pin.png"
            this.posts[i].type = "Info"
          }
          else if(this.posts[i].type == "BEAR_ALERT"){
            this.markers[i].type = "/assets/red_pin_cuter.png"
            this.posts[i].type = "Bear Alert"

          }
          else if(this.posts[i].type == "POISONOUS"){
            this.markers[i].type ="/assets/rsz_1purple_pin.png"
            this.posts[i].type = "Poisonous"
          }
          let mushroomTypeRaw = this.posts[i].mushroomType
          this.posts[i].mushroomType =  mushroomTypeRaw.charAt(0) + mushroomTypeRaw.substring(1).toLowerCase();
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
      data: {markers:this.markers,posts:this.posts, fromProfile:false},
    })
  }
  openPredictWindow(): void {
     const dialogRef = this.dialog.open(PredictorDialogComponent, {
      data: {img:"random"},
      panelClass: 'rounded-dialog'

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

        for (let i = 0; i < this.posts.length; i++){
          if (this.posts[i].type == "INFO"){
            this.posts[i].type = "assets/green_pin.png"
          }
          else if(this.posts[i].type == "BEAR_ALERT"){
            this.posts[i].type = "/assets/red_pin_cuter.png"
          }
          else if(this.posts[i].type == "POISONOUS"){
            this.posts[i].type ="/assets/rsz_1purple_pin.png"
          }
        }
        this.markers = this.posts.map((el => ({ lat: el.latitude, lng: el.longitude, type:el.type})));
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
     window.location.reload();
    })
  }

  refreshList($event: Post[] | void) {
    console.log($event)
    window.location.reload();
  }

  goToProfilePage() {

    this.router.navigate(['../profile', {posts: this.posts, markers:this.markers}])
  }
    goToTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }

}

