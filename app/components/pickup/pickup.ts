import {Component, Input, Output, EventEmitter, OnChanges, OnInit} from '@angular/core';
import {CarService} from '../../providers/car/car';
import {PickupPubSub} from '../../providers/pickup-pub-sub/pickup-pub-sub';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'pickup',
  templateUrl: 'build/components/pickup/pickup.html',
  providers: []
})
export class PickupDirective implements OnInit, OnChanges {
  @Input() isPinSet: boolean;
  @Input() map: google.maps.Map;
  @Input() isPickupRequested: boolean;
  @Input() destination: string;
  @Output() updatedPickupLocation: EventEmitter<google.maps.LatLng> = new EventEmitter<google.maps.LatLng>();
  
  private pickupMarker: google.maps.Marker;
  private popup: google.maps.InfoWindow;
  private pickupSubscription: any;
  
  constructor(private pickupPubSub: PickupPubSub) {

  }
  
  ngOnInit() {
    this.pickupSubscription = this.pickupPubSub.watch().subscribe(e => {
      if (e.event === this.pickupPubSub.EVENTS.ARRIVAL_TIME) {
        this.updateTime(e.data);
      }
    })
  }

  ngOnChanges(changes) {
    console.log(changes);
    
    // do not allow pickup pin/location
    // to change if pickup is requested
    if (!this.isPickupRequested) {
      if (this.isPinSet) {
        this.showPickupMarker();
      }
      else {
        this.removePickupMarker();
      }
    }
    
    if (this.destination) {
      this.removePickupMarker();
    }
    
  }
  
  showPickupMarker() {
    
    this.removePickupMarker();

    this.pickupMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.BOUNCE,
      position: this.map.getCenter(),
      icon: 'img/person-icon.png'
    })
    
    setTimeout( () => {
      this.pickupMarker.setAnimation(null);
    }, 750);

    this.showPickupTime();
    
    // send pickup location
    this.updatedPickupLocation.next(this.pickupMarker.getPosition());
  }
  
  removePickupMarker() {
    if (this.pickupMarker) {
      this.pickupMarker.setMap(null);
      this.pickupMarker = null;
    }
  }
  
  showPickupTime() {
    this.popup = new google.maps.InfoWindow({
      content: '<h5>You Are Here</h5>'
    });
    
    this.popup.open(this.map, this.pickupMarker);
    
    google.maps.event.addListener(this.pickupMarker, 'click', () => {
      this.popup.open(this.map, this.pickupMarker);
    });
  }
  
  updateTime(seconds) {
    let minutes = Math.floor(seconds/60);
    this.popup.setContent(`<h5>${minutes} minutes</h5>`);
  }

}
