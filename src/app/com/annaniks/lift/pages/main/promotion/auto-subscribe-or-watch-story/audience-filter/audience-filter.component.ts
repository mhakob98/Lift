import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';

import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SubSink } from 'subsink'
import { AudienceFilter } from '../../../../../core/models/audience-filter'

@Component({
  selector: 'app-audience-filter',
  templateUrl: './audience-filter.component.html',
  styleUrls: ['./audience-filter.component.scss']
})
export class AudienceFilterComponent implements OnInit, OnDestroy {
  public filterAudienceForm: FormGroup
  private _filters: AudienceFilter[];
  private _subs = new SubSink();
  constructor(
    private _formBuilder: FormBuilder,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService
  ) {
    this._filters = []
  }

  ngOnInit() {
    this._initForm()
    this._fetchAllFilter();

  }
  private _initForm(): void {
    this.filterAudienceForm = this._formBuilder.group({
      filters: this._formBuilder.array([])
    })
  }

  private _fetchAllFilter(): void {
    this._subs.add(
      this._autoSubscribeOrWatchStoryService.fetchAllFilters$
        .pipe(
          tap((f: AudienceFilter[]) => {
            f.map((filter: AudienceFilter) => {
              this._addFilter(filter)
            })
          }),
          catchError(of)
        ).subscribe()
    )

  }

  private _addFilter(filter: AudienceFilter): void {
    this._filters.push(filter);
    this.filtersGetter.push(this._formBuilder.control(filter));
  }

  public onSettingsSave(): void {
    const settings = this.filterAudienceForm.value;
    this._subs.add(
      this._autoSubscribeOrWatchStoryService.saveSettings(settings).subscribe(() => {

      })
    )

  }

  get filtersGetter() {
    return this.filterAudienceForm.get('filters') as FormArray;
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
