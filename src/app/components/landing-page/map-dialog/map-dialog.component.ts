import {Component, Inject, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Post} from "../../../data-type/Post";
import {Marker} from "../../../data-type/Marker";
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css']
})
export class MapDialogComponent implements OnInit {
  lat = 45.84390812570921
  lng = 24.971530777243718
  center = new google.maps.LatLng(this.lat,this.lng)
  zoom = 5
  ROMANIA_BOUNDS = {
    north: 48.46723046062661,
    south: 43.306942557261806,
    west: 19.987220959549834,
    east: 30.00675167516294,
  };
  options: google.maps.MapOptions = {
    center :{lat:this.lat,lng:this.lng},
    zoom : this.zoom,
    restriction:{latLngBounds:this.ROMANIA_BOUNDS,  strictBounds: false},
    fullscreenControl:false,
  };
  markers : Marker[]|undefined;
  posts: Post[]|undefined;
  filteredGenuses : Observable<Post[]> |undefined;
  distinctPosts : Post[]=[]
  myControl = new FormControl<string | Post>('');
  constructor(public dialogRef: MatDialogRef<MapDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: {markers:Marker[], posts:Post[]},) {
    this.markers = this.data.markers;
    this.posts = this.data.posts;
  }

  ngOnInit(): void {

    this.distinctPosts = this.posts!.reduce((distinctPosts: Post[], post: Post) => {
      if (!distinctPosts.some((distinctPost) => distinctPost.mushroomType === post.mushroomType)) {
        distinctPosts.push(post);
      }
      return distinctPosts;
    }, []);
    console.log(this.distinctPosts)
    this.initializeFilteredList();
  }

  ngOnChanges(changes:SimpleChanges):void {
    console.log(changes)
    this.initializeFilteredList()
  }
  displayFn(post: Post): string {
    // If a post has been selected and it has a mushroom type than display that in the input field
    return post && post.mushroomType ? post.mushroomType : '';
  }

  showPostsOnMap(value: Post) {
    if (!value) {

      console.log("input field is empty")
    }
    console.log("from showPostsOnMap")
    console.log(value)
    let new_posts = this.posts!.filter(post => post.mushroomType ===value.mushroomType)

    console.log("new posts are:",new_posts)
    this.markers = new_posts.map((el => ({ lat: el.latitude, lng: el.longitude, type:el.type})));
    console.log(this.markers)
  }

  private _filter(genus: string): Post[] {
    const filterValue = genus.toLowerCase();
    // @ts-ignore
    return this.distinctPosts.filter(option => {
      const localgenus = option.mushroomType
      if(localgenus.startsWith(filterValue)){
        return true;
      }
    });
  }


  initializeFilteredList(){
    this.myControl.reset();
    this.filteredGenuses = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const genus = typeof value === 'string' ? value : value?.mushroomType;
        return genus ? this._filter(genus as string) : this.distinctPosts!.slice();
      }),
    );
  }


  resetMapValues(event: any) {
    this.markers = this.posts!.map(el => ({ lat: el.latitude, lng: el.longitude, type:el.type}));
    console.log("markers",this.markers)
    console.log("resetez acuma valorile la cele initiale primite de la componenta principala")
  }
}
