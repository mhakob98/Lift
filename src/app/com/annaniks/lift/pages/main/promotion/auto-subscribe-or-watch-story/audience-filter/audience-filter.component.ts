import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';

import { of, Subject } from 'rxjs';
import { catchError, tap, takeUntil, take } from 'rxjs/operators';

import { AudienceFilter } from '../../../../../core/models/audience-filter'

@Component({
  selector: 'app-audience-filter',
  templateUrl: './audience-filter.component.html',
  styleUrls: ['./audience-filter.component.scss']
})
export class AudienceFilterComponent implements OnInit, OnDestroy {
  public filterAudienceForm: FormGroup
  private _filters: AudienceFilter[];
  private _unsubscribe$ = new Subject<void>()
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
    this._autoSubscribeOrWatchStoryService.fetchAllFilters$
      .pipe(
        takeUntil(this._unsubscribe$),
        tap((f: AudienceFilter[]) => {
          f.map((filter: AudienceFilter) => {
            this._addFilter(filter)
          })
        }),
        catchError(of)
      ).subscribe()
  }

  private _addFilter(filter: AudienceFilter): void {
    this._filters.push(filter);
    this.filtersGetter.push(this._formBuilder.control(filter));
  }

  get filtersGetter() {
    return this.filterAudienceForm.get('filters') as FormArray;
  }

  ngOnDestroy() {
    this._unsubscribe$.next()
    this._unsubscribe$.complete()
  }
}
