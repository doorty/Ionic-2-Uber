import {Component, OnInit, Input} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {Observable} from 'rxjs/Observable';
import {PickupDirective} from '../pickup/pickup';
import {AvailableCarsDirective} from '../available-cars/available-cars';
import {PickupCarDirective} from '../pickup-car/pickup-car';
import {CarService} from '../../providers/car/car';

@Component({
  selector: 'map',
  templateUrl: 'build/components/map/map.html',
  directives: [PickupDirective, AvailableCarsDirective, PickupCarDirective],
  providers: [CarService]
})
export class MapDirective implements OnInit {
  
  @Input() isPickupRequested: boolean;
  @Input() destination: string;
  
  public map: google.maps.Map;
  public isMapIdle: boolean;
  public currentLocation: google.maps.LatLng;
  
  constructor(public nav: NavController, public loadingCtrl: LoadingController) {
    
  }
  
  ngOnInit() {
    this.map = this.createMap();
    this.addMapEventListeners();
    
    this.getCurrentLocation().subscribe(location => {
      this.centerLocation(location);
    });
  }
  
  updatePickupLocation(location) {
    this.currentLocation = location;
    this.centerLocation(location);
  }
  
  addMapEventListeners() {
    
    google.maps.event.addListener(this.map, 'dragstart', () => {
      this.isMapIdle = false;
    })
    google.maps.event.addListener(this.map, 'idle', () => {
      this.isMapIdle = true;
    })
    
  }
  
  getCurrentLocation(): Observable<google.maps.LatLng> {
    
    let loading = this.loadingCtrl.create({
      content: 'Locating...'
    });
    
    loading.present(loading);
    
    let options = {timeout: 10000, enableHighAccuracy: true};
    
    let locationObs = Observable.create(observable => {
      
      Geolocation.getCurrentPosition(options)
        .then(resp => {
          let lat = resp.coords.latitude;
          let lng = resp.coords.longitude;
          
          let location = new google.maps.LatLng(lat, lng);
          
          console.log('Geolocation: ' + location);
          
          observable.next(location);
          
          loading.dismiss();
        },
        (err) => {
          console.log('Geolocation err: ' + err);
          loading.dismiss();
        })

    })
    
    return locationObs;
  }
  
  createMap(location = new google.maps.LatLng(40.712784, -74.005941)) {
    let mapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    
    let mapEl = document.getElementById('map');
    let map = new google.maps.Map(mapEl, mapOptions);
    
    return map;
  }
  
  centerLocation(location) {
    
    if (location) {
      this.map.panTo(location);
    }
    else {
      
      this.getCurrentLocation().subscribe(currentLocation => {
        this.map.panTo(currentLocation);
      });
    }
  }
}
