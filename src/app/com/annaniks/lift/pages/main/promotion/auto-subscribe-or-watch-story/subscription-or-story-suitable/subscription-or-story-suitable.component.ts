import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { SubSink } from 'subsink';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { combineLatest, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';


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
  private _subs = new SubSink();
  public conditions: number[] = []



  constructor(
    private _fb: FormBuilder,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService
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

  public onChange($event, control: FormControl): void {
    control.patchValue($event.value, { emitEvent: false });
  }

  public onSave(): void {
    console.log(this._autoSubscribeOrWatchStoryService.selectedHashtags);
    console.log(this._autoSubscribeOrWatchStoryService.selectedLocations);
    console.log(this._autoSubscribeOrWatchStoryService.selectedSubscribes);
    console.log(this._autoSubscribeOrWatchStoryService.likesTo);
    console.log(this._autoSubscribeOrWatchStoryService.commentTo);
    console.log(this._autoSubscribeOrWatchStoryService.subscribesTo);
    this._subs.add(
      this._autoSubscribeOrWatchStoryService.saveSettings({
        "loginId": "2",
        "tags": this._autoSubscribeOrWatchStoryService.selectedHashtags,
        "followersByAccounts": this._autoSubscribeOrWatchStoryService.subscribesTo,
        "commentersByAccounts": this._autoSubscribeOrWatchStoryService.commentTo,
        "location": this._autoSubscribeOrWatchStoryService.selectedLocations,
        "likers": this._autoSubscribeOrWatchStoryService.likesTo,
        "likeCountForFollower": 2,
        "seeStories": true,
        "dontFollowHiddenAccounts": false,
        "hidePostsAndStories": true,
        "comments": [],
        "hidePosts": true,
        "hideStories": false,
        "unfollowDays": 5,
        "followTime": {
          "start": "02-05-2020",
          "end": "10-10-2020"
        },
        "filter": {}
      }).subscribe((data) => {
        console.log(data);

      })
    )

  }
  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
