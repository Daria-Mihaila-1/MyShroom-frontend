import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PredictorDialogComponent} from "./predictor-dialog/predictor-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {PostService} from "../../services/post.service";
import {Post} from "../../data-type/Post";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

const iconBase =
  "https://developers.google.com/maps/documentation/javascript/examples/full/images/";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})


export class LandingPageComponent implements OnInit {
  @ViewChild('map', {static: false}) mapElement: ElementRef | undefined;
  map: google.maps.Map | undefined;
  lat = 45.84390812570921
  lng = 24.971530777243718
  center = new google.maps.LatLng(this.lat,this.lng)
  posts: Post[] = [];
  markers : marker[] =[];
  marker_icons:string[] = [];

  constructor(private dialog : MatDialog,
              private postService: PostService,
              private authService : AuthService,
              private router : Router) {

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
      })

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
  }
}

class marker {
  lat!: number;
  lng!: number;

  type:string ="";

}
