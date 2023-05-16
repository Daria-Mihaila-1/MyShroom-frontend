import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {PredictorDialogComponent} from "../landing-page/predictor-dialog/predictor-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {CreatePostComponent} from "../create-post/create-post.component";
import {PostService} from "../../services/post.service";
import {Post} from "../../data-type/Post";
import {Marker} from "../../data-type/Marker";
import {AuthService} from "../../services/auth.service";
import {CookieService} from "ngx-cookie-service";
import {User} from "../../data-type/User";
import {UserService} from "../../services/user.service";
import {MatList} from "@angular/material/list";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, AfterViewInit{
  myPosts : Post[] | undefined;
  myReportedPosts : Post[] | undefined;
  markers : Marker[] | undefined;

  myUser : User | undefined;
  modifiedUserRank : string | undefined;
  sharedPostsPercentage : number = 0;
   postsNumberUpperBound : number = 0;
   profileImageArray : string[]= [];
   myProfileImg : string = "";
  @ViewChild("matList") postsMatList : MatList | undefined;

  constructor(private router: Router,
              public dialog : MatDialog,
              private postService : PostService,
              private cookieService : CookieService,
              private authService : AuthService,
              private userService : UserService,
              ) {

    this.profileImageArray = ["/assets/fairy_PNG96.png", "/assets/little_mushroom.png", "/assets/little_mushroom_profile_img.png"]

    this.userService.getUserById(parseInt(localStorage.getItem('user')!)).subscribe( result => {
      this.myUser = result;
      this.myProfileImg = this.profileImageArray[this.myUser?.profileImageIndex!]
      console.log(this.myUser)
      this.modifiedUserRank = this.myUser!.rank[0] + this.myUser!.rank.substring(1).toLowerCase();
    },
      error => {
        this.router.navigate(['../login'])
        console.log("token probably expired")
        console.log(error)
        localStorage.setItem("tokenStatus", "isExpired")
      })

    this.postService.getMyPosts().subscribe(data => {
        this.myPosts = data.reverse();
        this.markers = this.myPosts.map((el => ({lat: el.latitude, lng: el.longitude, type: el.type})));
        if (this.myUser?.rank == 'BEGINNER'){
          this.sharedPostsPercentage = 100*this.myPosts.length/5
          this.postsNumberUpperBound = 5;
        }
        else if (this.myUser?.rank == 'INTERMEDIATE') {
          this.sharedPostsPercentage = 100*this.myPosts.length/15
        this.postsNumberUpperBound = 15;
        }
        else {
          this.sharedPostsPercentage = 100
        }

        //TODO: fa markerele pe tipuri
      },
      error => {
        this.router.navigate(['../login'])
        console.log("token probably expired")
        localStorage.setItem("tokenStatus", "isExpired")
      })

    this.postService.getMyReportedPosts().subscribe( result =>
    {
      this.myReportedPosts = result;

    })
  }

  ngOnInit() {



  }

  ngAfterViewInit() {

  }

  goToLandingPage() {
    this.router.navigate(['../landing-page'])
  }

  openPredictWindow(): void {

    const dialogRef = this.dialog.open(PredictorDialogComponent, {
      data: {img: "ceva random boss"}
    });
  }

  openCreatePost() {
    let dialogRef = this.dialog.open(CreatePostComponent)

    dialogRef.afterClosed().subscribe( result =>
    {
      this.postService.getPostsNotReportedByMe().subscribe(data =>
        {
          this.myPosts = data.reverse();
          this.markers = this.myPosts.map((el => ({ lat: el.latitude, lng: el.longitude, type:el.type})));
        },
        err => {

          this.router.navigate(['../login'])
          localStorage.setItem("tokenStatus", "isExpired")
        })
    })
  }


  signOut() {
    this.authService.signOutUser();
    this.router.navigate(['../login'])
    this.cookieService.set("token","")
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
