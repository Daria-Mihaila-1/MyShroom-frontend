import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../../../data-type/Post";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../../confirmation-dialog/confirmation-dialog.component";
import {CreatePostComponent} from "../../create-post/create-post.component";
import {PostService} from "../../../services/post.service";
import {compileResults} from "@angular/compiler-cli/src/ngtsc/annotations/common";
import {UserService} from "../../../services/user.service";
import {ReportPost} from "../../../data-type/ReportPost";
import {User} from "../../../data-type/User";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post:Post|undefined;
  @Output() deletePostEvent = new EventEmitter<number>();
  @Output() updatePostEvent = new EventEmitter<void>();
  @Output() reportPostEvent = new EventEmitter<Post[]>();
  data_uri: string|undefined;
  myUser : User | undefined;
  signature = {
    "/9j/": "image/jpg"
  }
  data_source:any = [];

  myId : number = -1;
  constructor(
  public dialog : MatDialog,
  private postService : PostService, private userService:UserService, private snackbar: MatSnackBar,) {
  }

  ngOnInit(): void {
    if (this.post){
      this.userService.getUserById(this.post!.userId).subscribe( result => {
        this.myUser = result;
      })
      if (this.post.base64Img.indexOf("/9j/") == 0){
        let content_type = "data:image/jpg;base64"
        this.data_uri = content_type + "," + this.post.base64Img
        this.myId = parseInt(localStorage.getItem('user')!);
      }

      }
    }

  deletePost(post : Post) {
    const dialogResponse = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px', data: "Are you sure you want to delete your post?",
      autoFocus: false
    });
    dialogResponse.afterClosed().subscribe(result => {
      if (result) {
      this.deletePostEvent.emit(this.post!.id)
      }
    });
  }

  // When clicking on edit button open CreatePostComponent with already given post data
  openUpdatePost() {
    let dialogRef = this.dialog.open(CreatePostComponent, {data: {post: this.post}})
    dialogRef.afterClosed().subscribe( result =>
    {
      this.updatePostEvent.emit()
    })
  }

  reportPost() {
    const reportPost : ReportPost =
    {
      reporterUserId:parseInt(localStorage.getItem('user')!),
      postId: this.post?.id!
    }
    this.userService.report(reportPost).subscribe(result =>{
      this.reportPostEvent.emit(result)
    })
  }
}


