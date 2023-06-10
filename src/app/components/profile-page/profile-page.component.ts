import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {PredictorDialogComponent} from "../landing-page/predictor-dialog/predictor-dialog.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CreatePostComponent} from "../create-post/create-post.component";
import {PostService} from "../../services/post.service";
import {Post} from "../../data-type/Post";
import {Marker} from "../../data-type/Marker";
import {AuthService} from "../../services/auth.service";
import {CookieService} from "ngx-cookie-service";
import {User} from "../../data-type/User";
import {UserService} from "../../services/user.service";
import {MatList} from "@angular/material/list";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MapDialogComponent} from "../landing-page/map-dialog/map-dialog.component";
import {DialogConfig} from "@angular/cdk/dialog";

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
   avatars : string[]= [];
   myProfileImg : string = "";
   strikesCountColor : string = ""
  @ViewChild("matList") postsMatList : MatList | undefined;

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

  constructor(private router: Router,
              public dialog : MatDialog,
              private postService : PostService,
              private cookieService : CookieService,
              private authService : AuthService,
              private userService : UserService,
  ) {

    let main_dir = "/assets/avatars/"
    this.avatars  = [main_dir + "fairy_.png",
      main_dir + "mushroom_.png",  main_dir + "forager_.png", main_dir + "towering_mushroom_.png"]
    if(this.myUser?.strikes == 1)
      this.strikesCountColor = "#00cc00"
    else if (this.myUser?.strikes == 2)
      this.strikesCountColor = "#ff6600"
    else if (this.myUser?.strikes == 3)
      this.strikesCountColor = "#ff0000"

      this.userService.getUserById(parseInt(localStorage.getItem('user')!)).subscribe( result => {
          this.myUser = result;
          this.myProfileImg = this.avatars[this.myUser?.profileImageIndex!]
          console.log(this.myUser?.profileImageIndex)
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

      for (let i = 0; i < this.myPosts.length; i++) {
        if (this.myPosts[i].type == "INFO") {
          this.markers[i].type = "assets/green_pin.png"
          this.myPosts[i].type = "Info"
        } else if (this.myPosts[i].type == "BEAR_ALERT") {
          this.markers[i].type = "/assets/red_pin_cuter.png"
          this.myPosts[i].type = "Bear Alert"

        } else if (this.myPosts[i].type == "POISONOUS") {
          this.markers[i].type = "/assets/rsz_1purple_pin.png"
          this.myPosts[i].type = "Poisonous"
        }
      }
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
        for (let i = 0; i < this.myPosts.length; i++){
          let mushroomTypeRaw = this.myPosts[i].mushroomType
          this.myPosts[i].mushroomType =  mushroomTypeRaw.charAt(0) + mushroomTypeRaw.substring(1).toLowerCase();
        }

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

  openCreatePost() {


    let dialogRef = this.dialog.open(CreatePostComponent)

    dialogRef.afterClosed().subscribe( result =>
    {
      console.log(result)
      if (result) {
       window.location.reload()
      }
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

  deleteAccount() {
    const dialogResponse = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px', data: "Are you sure you want to delete your account?",
      autoFocus: false
    });
    dialogResponse.afterClosed().subscribe(result => {
      if (result) {
        this.userService.delete().subscribe(result =>
          console.log(result));
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.setItem("tokenStatus", "notExpired");
        this.router.navigate(['../login'])
      }
    });
  }

  openMapDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.data = {markers:this.markers, posts:this.myPosts, fromProfile:true}
    this.dialog.open(MapDialogComponent, dialogConfig)
  }

  deletePost($event: number) {

    this.postService.deletePost($event).subscribe( data => {
      window.location.reload();
    })
  }
}
