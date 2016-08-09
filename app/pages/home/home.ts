import {AlertController, NavController} from 'ionic-angular';
import {MapDirective} from '../../components/map/map';
import {PickupPubSub} from '../../providers/pickup-pub-sub/pickup-pub-sub';
import {DestinationAddressDirective} from '../../components/destination-address/destination-address';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/pages/home/home.html',
  directives: [MapDirective, DestinationAddressDirective],
  providers: [PickupPubSub]
})
export class HomePage {
  
  public isPickupRequested: boolean;
  public isRiderPickedUp: boolean;
  public pickupSubscription: any;
  public timeTillArrival: number;
  public destination: string;
  
  constructor(
    public nav: NavController, 
    private pickupPubSub: PickupPubSub,
    private alertCtrl: AlertController) {
      this.isPickupRequested = false;
      this.isRiderPickedUp = false;
      this.timeTillArrival = 5;
      this.pickupSubscription = this.pickupPubSub.watch().subscribe(e => {
        this.processPickupSubscription(e);
      })
  }
  
  processPickupSubscription(e) {
    switch(e.event) {
      case this.pickupPubSub.EVENTS.ARRIVAL_TIME:
        this.updateArrivalTime(e.data);
        break;
      case this.pickupPubSub.EVENTS.PICKUP:
        this.riderPickedUp();
        break;
      case this.pickupPubSub.EVENTS.DROPOFF:
        this.riderDroppedOff();
        break;
    }
  }
  
  setDestination(destination) {
    this.destination = destination;
  }
  
  riderPickedUp() {
    this.isRiderPickedUp = true;
  }
  
  rateDriver() {
    let prompt = this.alertCtrl.create({
      title: 'Rate Driver',
      message: 'Select a rating for your driver',
      inputs: [{
        type: 'radio',
        label: 'Perfect',
        value: 'perfect',
        checked: true
      },
      {
        type: 'radio',
        label: 'Okay',
        value: 'okay'
      },
      {
        type: 'radio',
        label: 'Horrible',
        value: 'horrible'
      }],
      buttons: [{
        text: 'Submit',
        handler: rating => {
          // TODO: send rating to server
          console.log(rating);
        }
      }]
    });
    
    prompt.present(prompt);
  }
  
  riderDroppedOff() {
    this.rateDriver();
    this.isRiderPickedUp = false;
    this.isPickupRequested = false;
    this.destination = null;
    this.timeTillArrival = 5;
  }
  
  updateArrivalTime(seconds) {
    let minutes = Math.floor(seconds/60);
    this.timeTillArrival = minutes;
  }
  
  confirmPickup() {
    this.isPickupRequested = true;
  }
  
  cancelPickup() {
    this.isPickupRequested = false;
  }
}
