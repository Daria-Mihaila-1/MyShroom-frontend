import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../../../data-type/Post";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post:Post|undefined;
  data_uri: string|undefined;
  signature = {
    "/9j/": "image/jpg"
  }
  data_source:any = [];

  constructor() { }

  ngOnInit(): void {
    if (this.post){
      console.log("from post component")
      console.log(this.post.title)
      console.log(this.post.base64Img.indexOf("/9j/"))
      if (this.post.base64Img.indexOf("/9j/") == 0){
        let content_type = "data:image/jpg;base64"
        this.data_uri = content_type + "," + this.post.base64Img
      }

      }
    }

  seeOptions() {
    console.log("am dat click pe more fraierilor")
  }
}


