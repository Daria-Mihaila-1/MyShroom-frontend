import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Post} from "../../data-type/Post";
import {Marker} from "../../data-type/Marker";
import {GoogleMap, MapInfoWindow} from "@angular/google-maps";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {

  @Input() options!: google.maps.MapOptions ;
  @Input() markers: Marker[] | undefined;
  @Input() width: number | undefined;
  @Input() height: number | undefined;

  @ViewChild('infoWindow') infoWindow!:ElementRef;
  infoWindowIsVisible : boolean = false;

  myLat: number = 0;
  myLng: number = 0;
  myLocationMarkerImage = "https://img.icons8.com/material-rounded/38/000000/marker.png"
  markerOptions!: google.maps.MarkerOptions;
  mapElement: any;

  constructor() {

  }

  ngOnInit(): void {

    if (!navigator.geolocation) {
      console.log("navigator not supported")
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        this.myLat = position.coords.latitude
        this.myLng = position.coords.longitude
      })
    }

     this.watchPosition();


  }

  watchPosition() {
    navigator.geolocation.watchPosition((position) => {
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
    console.log(this.options)
  }

  handleMapInitialized(map: google.maps.Map) {


    console.log("am initializat harta")
    this.markerOptions = { position:{lat:this.myLat, lng:this.myLng},
      map
    }
  }

  // Show info window when hovering over myLocation marker
  showInfoWindow($event: google.maps.MapMouseEvent) {
    console.log("am trecut peste locatia mea frajerilor")
    this.infoWindowIsVisible = true;

  }
}
