import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {Post} from "../../data-type/Post";
import {Marker} from "../../data-type/Marker";
import {GoogleMap} from "@angular/google-maps";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() options!: google.maps.MapOptions ;
  @Input() markers: Marker[] | undefined;
  @Input() width: number | undefined;
  @ViewChild("map", { static: false }) map!: GoogleMap;


  constructor() {
  }

  myLat: number = 0;
  myLng: number = 0;



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
        console.log("ceva din watch position apelat in ngOnInit")
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
}
