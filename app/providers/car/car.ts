import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {SimulateService} from '../simulate/simulate';
import 'rxjs/add/operator/map';


@Injectable()
export class CarService {
  
  public simulate: SimulateService;

  constructor() {
    this.simulate = new SimulateService();
  }
  
  pollForRiderPickup() {
    return this.simulate.riderPickedUp();
  }
  
  pollForRiderDropoff() {
    return this.simulate.riderDroppedOff();
  }
  
  dropoffCar(pickupLocation, dropoffLocation) {
    return this.simulate.dropoffPickupCar(pickupLocation, dropoffLocation);
  }
  
  getPickupCar() {
    return this.simulate.getPickupCar();
  }
  
  findPickupCar(pickupLocation) {
    return this.simulate.findPickupCar(pickupLocation);
  }

  getCars(lat, lng) {
    return Observable
      .interval(2000)
      .switchMap(()=> this.simulate.getCars(lat, lng))
      .share();
  }
}

