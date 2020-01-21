import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { SubSink } from 'subsink';
import { SearchTerm, Search } from 'src/app/com/annaniks/lift/core/models/search';
import { Observable } from 'rxjs';
import { Coordinates } from 'src/app/com/annaniks/lift/core/models/coordinates';
declare var google;
@Component({
  selector: 'app-account-by-location',
  templateUrl: './account-by-location.component.html',
  styleUrls: ['./account-by-location.component.scss']
})
export class AccountByLocationComponent implements OnInit {
  @Output('searched')
  private _searched = new EventEmitter<SearchTerm>();


  @Input('searchValue')
  public searchValue: Observable<Search>

  public locationForm: FormGroup;
  public locationsItems: FormArray;
  private _map: any;
  public text: string;

  public results: string[];
  private _subs = new SubSink();

  constructor(
    private _fb: FormBuilder,
    private _subscribeStoryService: AutoSubscribeOrWatchStoryService

  ) { }

  ngOnInit() {
    this._formBuilder()
  }

  private _initMap(corrdinates = { lat: 40.7865229, lng: 43.8476395 }, zoom = 15): void {
    this._map = new google.maps.Map(document.getElementById("map"), {
      zoom: zoom,
      center: corrdinates,
      disableDefaultUI: true,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ]
    });
  }


  public search(event): void {
    this._searched.emit({ type: "place", query: event.query })
  }

  public createMarker(): void {
    var myLatLngList = {
      lat: 37.76487, lng: -122.41948
    };
    var marker = new google.maps.Marker({
      position: myLatLngList,
      map: this._map,
      title: 'markers'
    });
    this._map.setCenter(marker.getPosition());
  };


  private _formBuilder(): void {
    this.locationForm = this._fb.group({
      items: this._fb.array([])
    });
    this.locationForm.valueChanges.subscribe(() => {
      console.log(this.locationForm.value);

    })
    this._initMap()

  }

  public createItem(): FormGroup {
    return this._fb.group({ label: '' });
  }

  public addItem(): void {
    this.locationsItems = this.locationForm.get('items') as FormArray;
    this.locationsItems.push(this.createItem());
  }

  public deleteLocation(locationIndex: number): void {
    this.locationsItems.removeAt(locationIndex)
  }

  public clearAll(): void {
    while (this.locationsItems.length !== 0) {
      this.locationsItems.removeAt(0)
    }
    // this.locationsItems = this._fb.array([]);
  }

  public writeValueToService(): void {
    let locations: Coordinates[] = []
    this.locationForm.value.items.map((coordinate) => {
      locations.push(coordinate.label)
    })
    console.log("locations AREEEEEE", locations);

    this._subscribeStoryService.selectedLocations = locations
  }

  get itemsControl(): FormArray {
    return this.locationForm.get('items') as FormArray;
  }

}
