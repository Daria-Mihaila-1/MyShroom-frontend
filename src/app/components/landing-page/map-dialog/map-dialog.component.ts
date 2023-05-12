import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Post} from "../../../data-type/Post";
import {Marker} from "../../../data-type/Marker";
import {FormBuilder, FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {map, Observable, of, startWith, Subject} from "rxjs";
import {ErrorStateMatcher} from "@angular/material/core";
import {MatSnackBar} from "@angular/material/snack-bar";


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css']
})
export class MapDialogComponent implements OnInit{
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
  filteredGenuses : Observable<Post[]> |undefined = of([]);
  distinctPosts : Post[]=[]
  currentLocation : google.maps.LatLng | undefined;
  myControl = new FormControl<string | Post>('');
  kmInput = new FormControl('', [Validators.required, Validators.pattern("([1-9]+[0-9]*[.])?[1-9]+[0-9]*")]);
  matcher = new MyErrorStateMatcher();
  kmFormGroup = this.formBuilder.group(
    {
      kmInput : '',
    }
  )

  //Subject to send to map if a km input is entered
  createCircleSubject:Subject<[Marker[], number]> = new Subject();

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: {markers:Marker[], posts:Post[]},
  private formBuilder: FormBuilder,

  private snackBar : MatSnackBar) {
    this.markers = this.data.markers;
    this.posts = this.data.posts;
  }

  ngOnInit(): void {


    // Create a list of posts that have distinct genuses for filtering of map markers later
    this.distinctPosts = this.posts!.reduce((distinctPosts: Post[], post: Post) => {
      if (!distinctPosts.some((distinctPost) => distinctPost.mushroomType === post.mushroomType)) {
        distinctPosts.push(post);
      }
      return distinctPosts;
    }, []);
    // console.log(this.distinctPosts)
    this.initializeFilteredList();
  }

  displayFn(post: Post): string {
    // If a post has been selected and it has a mushroom type than display that in the input field
    return post && post.mushroomType ? post.mushroomType : '';
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


  showPostsOnMap(value: Post) {
    if (!value) {
      console.log("input field is empty")
    }
    let new_posts = this.posts!.filter(post => post.mushroomType ===value.mushroomType)

    this.markers = new_posts.map((el => ({ lat: el.latitude, lng: el.longitude, type:el.type})));
  }






  resetMapValues(event: any) {
    this.markers = this.posts!.map(el => ({ lat: el.latitude, lng: el.longitude, type:el.type}));
    console.log("resetez acuma valorile la cele initiale primite de la componenta principala")
  }



  // Create a list of the closest markers to my location
  // Send it along with the kmInput radius to the map to
  // Create a circle with the kmInput radius and highlight the closest markers
  getClosestMarkers() {
    let km = parseFloat(this.kmInput.value!)

    // Create list of the closest markers to send them to the map component
    let closestMarkers = this.markers?.filter(marker => this.getDistance(marker.lat, marker.lng) <= km);
    this.markers?.forEach( marker =>
    {
      if (this.getDistance(marker.lat, marker.lng) > km) console.log(this.getDistance(marker.lat, marker.lng), marker.lat, marker.lng, this.currentLocation?.lat(), this.currentLocation?.lng())
    })
    // Send the closest markers to the map component
    if (km < 370) {
      this.createCircleSubject.next([closestMarkers!, km * 1000]);
      this.kmInput.reset();

    }
    else {
        this.snackBar.open("radius is too big for Romania","Ok")
    }

  }
  //using the harvesine function to calculate the distance between two (lat, lng) map points
  getDistance(lat:number, lng:number):number  {

    let radius = 6371

    let myLat = this.currentLocation!.lat()
    let myLng = this.currentLocation!.lng()

    let deltaLatitude = (lat - myLat) * Math.PI / 180;
    let deltaLongitude = (lng - myLng) * Math.PI / 180;
    //cos(a rad) * cos(b rad) * sin^2(deltaLongitude/2) + sin^2(delta latitude/2)
    let halfChordLength = Math.cos(myLat *Math.PI / 180) * Math.cos(lat * Math.PI / 180)
      * Math.sin(deltaLongitude/2) * Math.sin(deltaLongitude/2)
      + Math.sin(deltaLatitude/2) * Math.sin(deltaLatitude/2);

    let angularDistance = 2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

    return angularDistance * radius;

  }

  setCurrentLocation(location: google.maps.LatLng) {
    this.currentLocation = location
  }


  clearCircle() {

  }
}
