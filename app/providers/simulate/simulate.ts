import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class SimulateService {
  
  public directionsService: google.maps.DirectionsService;
  public myRoute: any;
  public myRouteIndex: number;

  constructor() {
    this.directionsService = new google.maps.DirectionsService();
  }
  
  riderPickedUp() {
    // simulate rider picked up after 1 second
    return Observable.timer(1000);
  }
  
  riderDroppedOff() {
    // simulate rider dropped off after 1 second
    return Observable.timer(1000);
  }
  
  getPickupCar() {
    return Observable.create(observable => {
      
      let car = this.myRoute[this.myRouteIndex];
      observable.next(car);
      this.myRouteIndex++;
      
    })
  }
  
  getSegmentedDirections(directions) {
    let route = directions.routes[0];
    let legs = route.legs;
    let path = [];
    let increments = [];
    let duration = 0;
    
    let numOfLegs = legs.length;
    
    // work backwards though each leg in directions route
    while (numOfLegs--) {
      
      let leg = legs[numOfLegs];
      let steps = leg.steps;
      let numOfSteps = steps.length;
      
      while(numOfSteps--) {
        
        let step = steps[numOfSteps];
        let points = step.path;
        let numOfPoints = points.length;
        
        duration += step.duration.value;
        
        while(numOfPoints--) {
          
          let point = points[numOfPoints];
          
          path.push(point);
          
          increments.unshift({
            position: point,  // car position 
            time: duration,  // time left before arrival
            path: path.slice(0) // clone array to prevent referencing final path array
          })
        }
      }
    }
    
    return increments;
  }
  
  calculateRoute(start, end) {
    
    return Observable.create(observable => {
      
      this.directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          observable.next(response);
        }
        else {
          observable.error(status);
        }
      })
    });
  }
  
  simulateRoute(start, end) {
    
    return Observable.create(observable => {
      this.calculateRoute(start, end).subscribe(directions => {
        // get route path
        this.myRoute = this.getSegmentedDirections(directions);
        // return pickup car
        this.getPickupCar().subscribe(car => {
          observable.next(car); // first increment in car path
        })
      })
    });
  }
  
  findPickupCar(pickupLocation) {
    
    this.myRouteIndex = 0;
    
    let car = this.cars1.cars[0]; // pick one of the cars to simulate pickupLocation
    let start = new google.maps.LatLng(car.coord.lat, car.coord.lng);
    let end = pickupLocation;
    
    return this.simulateRoute(start, end);
  }
  
  dropoffPickupCar(pickupLocation, dropoffLocation) {
    return this.simulateRoute(pickupLocation, dropoffLocation);
  }

  getCars(lat, lng) {
    
    let carData = this.cars[this.carIndex];
    
    this.carIndex++;
    
    if (this.carIndex > this.cars.length-1) {
      this.carIndex = 0;
    }
    
    return Observable.create(
      observer => observer.next(carData)
    )
  }
  
  private carIndex: number = 0;
  
  private cars1 = {
    cars: [{
      id: 1,
      coord: {
        lat: -26.097551,
        lng: 28.050939
      }
    },
    {
      id: 2,
      coord: {
        lat: -26.102831,
        lng: 28.059951
      }
    }
  ]
 };
 
 private cars2 = {
    cars: [{
      id: 1,
      coord: {
        lat: -26.098823,
        lng: 28.050531
      }
    },
    {
      id: 2,
      coord: {
        lat: -26.100403,
        lng: 28.058728
      }
    }
  ]
 };
 
 private cars3 = {
    cars: [{
      id: 1,
      coord: {
        lat: -26.100750,
        lng: 28.050681
      }
    },
    {
      id: 2,
      coord: {
        lat: -26.101386,
        lng: 28.056196
      }
    }
  ]
 };
 
 private cars4 = {
    cars: [{
      id: 1,
      coord: {
        lat: -26.099864,
        lng: 28.052827
      }
    },
    {
      id: 2,
      coord: {
        lat: -26.102542,
        lng: 28.056754
      }
    }
  ]
 };
 
 private cars5 = {
    cars: [{
      id: 1,
      coord: {
        lat: -26.098765,
        lng: 28.055531
      }
    },
    {
      id: 2,
      coord: {
        lat: -26.103833,
        lng: 28.057398
      }
    }
  ]
 };
  
 private cars: Array<any> = [this.cars1, this.cars2, this.cars3, this.cars4, this.cars5];
  
  
}

