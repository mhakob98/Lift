import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { SubSink } from 'subsink';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';

@Component({
  selector: 'app-subscription-suitable',
  templateUrl: './subscription-or-story-suitable.component.html',
  styleUrls: ['./subscription-or-story-suitable.component.scss'],
})
export class SubscriptionOrStorySuitableComponent implements OnInit, OnDestroy {
  public step: number;
  public suitableSubsOrStoryForm: FormGroup;
  public conditionsForm: FormGroup;
  public conditionsItems: FormArray;
  public conditions: number[] = []

  constructor(
    private _fb: FormBuilder,
  ) { }

  ngOnInit() {
    this._initForm();
  }

  private _initForm(): void {
    this.suitableSubsOrStoryForm = this._fb.group({
      maximumPerDay: [200],
      maximumPerHour: [20],
      publicationTimeLimit: [false]
    })
  }

  public onChange($event, control: AbstractControl): void {
    control.patchValue($event.value, { emitEvent: false });
  }


  ngOnDestroy() {
  }
}
