import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { SearchTerm, Search } from '../../../../../core/models/search';
import { Observable, Subject } from 'rxjs';
import { Location } from '../../../../../core/models/account';
import { takeUntil } from 'rxjs/operators';
import gmapTheme from '../../../../../core/themes/gmap';
import { RequireMatchOfType } from 'src/app/com/annaniks/lift/core/utilities/type-validator';

declare var google;
@Component({
  selector: 'app-account-by-location',
  templateUrl: './account-by-location.component.html',
  styleUrls: ['./account-by-location.component.scss']
})
export class AccountByLocationComponent implements OnInit {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  private _map: any;
  private _markers: any[] = [];
  @Output('searched')
  private _searched = new EventEmitter<SearchTerm>();
  @Input('searchValue')
  public searchValue: Observable<Search>;
  public locationForm: FormGroup;
  public locationsItems: FormArray;
  public results: string[];

  constructor(
    private _fb: FormBuilder,
    private _subscribeStoryService: AutoSubscribeOrWatchStoryService

  ) { }

  ngOnInit() {
    this._formBuilder();
    this._initMap();
    this._checkSelectedLocations();
  }

  private _checkSelectedLocations(): void {
    this._subscribeStoryService.getSettingsByType('location')
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((locations: Location[]) => {
        this._resetProperties();
        const items = this.locationForm.get('items') as FormArray;
        if (locations && locations.length > 0) {
          locations.map((location: Location, index: number) => {
            this.locationsItems = this.locationForm.get('items') as FormArray;
            items.push(this._fb.group({ label: new FormControl(location, RequireMatchOfType) }));
            this.createMarker({ lat: location.location.lat, lng: location.location.lng });
          })
          this._zoomMarkers();
        }
      })
  }

  private _resetProperties(): void {
    this.locationForm = this._fb.group({
      items: this._fb.array([])
    });
    this._markers.map((element) => {
      element.setMap(null);
    })
  }

  private _formBuilder(): void {
    this.locationForm = this._fb.group({
      items: this._fb.array([])
    });
    this.locationForm.valueChanges
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((values) => {
        this.writeValueToService();
      });
  }

  private _initMap(corrdinates = { lat: 40.7865229, lng: 43.8476395 }, zoom = 15): void {
    this._map = new google.maps.Map(document.getElementById("map"), {
      zoom: zoom,
      center: corrdinates,
      disableDefaultUI: true,
      styles: [...gmapTheme]
    });
  }

  private _zoomMarkers(): void {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this._markers.length; i++) {
      bounds.extend(this._markers[i].getPosition());
    }
    this._map.fitBounds(bounds);
  }

  public search(event): void {
    this._searched.emit({ type: "place", query: event.query })
  }

  public createMarker(location: { lat: number, lng: number }): void {
    var marker = new google.maps.Marker({
      position: location,
      map: this._map,
      title: 'markers'
    });
    this._markers.push(marker);
    marker.setMap(this._map);
  };

  public createItem(): FormGroup {
    return this._fb.group({ label: new FormControl('', RequireMatchOfType) });
  }

  public addItem(): void {
    this.locationsItems = this.locationForm.get('items') as FormArray;
    this.locationsItems.push(this.createItem());
  }

  public deleteLocation(locationIndex: number): void {
    this._markers[locationIndex].setMap(null);
    this._markers.splice(locationIndex, 1);
    this._zoomMarkers();
    this.locationsItems.removeAt(locationIndex);
  }

  public clearAll(): void {
    while (this.locationsItems.length !== 0) {
      this.locationsItems.removeAt(0);
    }
    this._markers.map((marker) => {
      marker.setMap(null);
    })
    this._markers = [];
    this._map.setZoom(3);
  }

  public onBlur(index: number): void {

  }

  public writeValueToService(): void {
    let locations: Location[] = [];
    this.locationForm.value.items.map((coordinate: { label: Location }) => {
      locations.push(coordinate.label);
    });
    this._subscribeStoryService.settings.location = locations;
  }

  get itemsControl(): FormArray {
    return this.locationForm.get('items') as FormArray;
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
