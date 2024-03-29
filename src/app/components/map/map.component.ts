import {
  AfterViewInit,
  Component, DoCheck,
  ElementRef, EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit, Output,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Marker} from "../../data-type/Marker";
import {
  GoogleMap,
  MapCircle,
  MapInfoWindow,
  MapMarker,
  MapMarkerClusterer,
  MarkerClustererOptions
} from "@angular/google-maps";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Post} from "../../data-type/Post";
import {PostDialogComponent} from "../post-dialog/post-dialog.component";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges, AfterViewInit{

  @Input() options!: google.maps.MapOptions ;
  @Input() markers: Marker[] | undefined;
  @Input() width: number | undefined;
  @Input() height: number | undefined;
  @Input() posts: Post[] | undefined;
  @Input('createCircleSubject') createCircleSubject :{markers: Marker[], distance: number}

  @Output() newItemEvent = new EventEmitter<google.maps.LatLng>();

  @ViewChild('map') mapElement!: GoogleMap;
  @ViewChild('myInfoWindow') infoWindow: MapInfoWindow | undefined;
  @ViewChild('postInfoWindow') postInfoWindow: MapInfoWindow | undefined;

  @ViewChild('circle') mapCircle: MapCircle | undefined;

  myLat: number = 0;
  myLng: number = 0;
  myLocationMarkerImage = "https://img.icons8.com/material-rounded/38/000000/marker.png"

  myMarkerOptions!: google.maps.MarkerOptions;

  circleRadius : number = 0;
  closestMarkers : Marker[] = [];
  markerOptions!: google.maps.MarkerOptions;
  circleExists : boolean = false;
  markerClustererImagePath = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
@ViewChild("mapMarkerClusterer") mapMarkerClusterer : MapMarkerClusterer;



  constructor(public dialog : MatDialog) {
    if (!navigator.geolocation) {
      console.log("navigator not supported")
    } else {
      navigator.geolocation.getCurrentPosition((position) => {

          this.myLat = position.coords.latitude
          this.myLng = position.coords.longitude
          localStorage.setItem("myLat", this.myLat.toString())
          localStorage.setItem("myLng", this.myLng.toString())
        },
        err => {
          console.log("couldn't get user location")
        },
      )
    }
    this.myLat = parseFloat(localStorage.getItem("myLat")!)
    this.myLng = parseFloat(localStorage.getItem("myLng")!)
    this.watchPosition();
  }
  ngOnInit(): void {
    console.log(this.height)

    if (this.createCircleSubject) {
      console.log("subscribe")
    }
    else{
      console.log("undefined circle")
    }

  }

  centerMapToCircle() {
    let radius = this.mapCircle?.getRadius()! + this.mapCircle?.getRadius()! / 2;
    let scale = radius / 500;
    let zoomLevel = 16 - Math.log(scale) / Math.log(2);
    this.mapElement.googleMap!.setZoom(zoomLevel);
    this.mapElement.googleMap?.setCenter(this.mapCircle?.getCenter()!)

  }

  centerMap() {
    this.mapElement.googleMap?.setOptions(this.options)
  }
  ngAfterViewInit(): void {

    }

  watchPosition() {
    let id = navigator.geolocation.watchPosition((position) => {
      this.myLat = position.coords.latitude
      this.myLng = position.coords.longitude;

    },
      err => {
      console.log(err)
      },
      {
        enableHighAccuracy:false,
        timeout: 30000,
      })
  }


  ngOnChanges(changes:SimpleChanges) {

    if(this.createCircleSubject) {
      this.closestMarkers = this.createCircleSubject.markers;
      this.circleRadius = this.createCircleSubject.distance;
      if (this.closestMarkers.length != 0) {
        this.mapCircle?.circle?.setMap(this.mapElement.googleMap!)
        this.circleExists = true;
        console.log("circle exists")
        this.mapCircle?.circle?.setOptions({
          center: {lat: this.myLat!, lng: this.myLng!},
          radius: this.circleRadius
        })
        this.centerMapToCircle()
      } else {
        this.clearCircle()
      }
    }

  }

  handleMapInitialized(map: google.maps.Map) {

    this.newItemEvent.emit(new google.maps.LatLng({lat:this.myLat, lng:this.myLng}))

    this.myMarkerOptions = {
        position:{lat:this.myLat, lng:this.myLng},
      map
    }
    this.markerOptions = {
      animation: google.maps.Animation.DROP}
  }

  openPost(marker: Marker) {

    let filteredPosts  = this.posts?.filter(post =>
      post.latitude == marker.lat && post.longitude == marker.lng
    )

    const dialogConfig = new MatDialogConfig();
    dialogConfig.height="600px"
    dialogConfig.data  = filteredPosts![0]
    // {data:filteredPosts![0]}
    let dialogRef = this.dialog.open(PostDialogComponent,dialogConfig)
  }


  openInfoWindow(marker: MapMarker, indexOfelement: number = -1) {
    console.log(indexOfelement)
    if(indexOfelement == -1) {
      if (this.infoWindow != undefined) {
        this.infoWindow.infoWindow!.setOptions({
          content: "My location",
        })
        this.infoWindow?.open(marker);
      }
    }
    else {
      let post = this.posts![indexOfelement];
      let content_type = "data:image/jpg;base64"
      let data_uri = content_type + "," + post.base64Img

      this.postInfoWindow!.infoWindow!.setOptions(
        {
          content:"<img src='"+ data_uri +"' width='50px' height='50px' />"
        }
      )
      this.postInfoWindow?.open(marker)
    }
  }

  closeInfoWindow(selectedInfoWindow : MapInfoWindow) {
    if (selectedInfoWindow === this.infoWindow) this.infoWindow!.close()
    else this.postInfoWindow?.close()
  }


  clearCircle() {
    if (this.createCircleSubject) {
      this.mapCircle?.circle?.setMap(null);
      this.circleExists = !this.circleExists;
      this.centerMap()
    }
  }
}
