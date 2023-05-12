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
  posts : Post[] | undefined;
  markers : Marker[] | undefined;

  myUser : User | undefined;

  @ViewChild("matList") postsMatList : MatList | undefined;

  constructor(private router: Router,
              public dialog : MatDialog,
              private postService : PostService,
              private cookieService : CookieService,
              private authService : AuthService,
              private userService : UserService,
              ) {
  }

  ngOnInit() {
    this.postService.getMyPosts().subscribe(data => {
      this.posts = data.reverse();
      console.log(data)
      this.markers = this.posts.map((el => ({lat: el.latitude, lng: el.longitude, type: el.type})));

      //TODO: fa markerele pe tipuri
    })

    this.userService.getUserById(parseInt(localStorage.getItem('user')!)).subscribe( result =>{
      this.myUser = result;
    })
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
          this.posts = data.reverse();
          this.markers = this.posts.map((el => ({ lat: el.latitude, lng: el.longitude, type:el.type})));
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
