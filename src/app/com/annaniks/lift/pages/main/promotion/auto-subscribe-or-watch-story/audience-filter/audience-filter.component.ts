import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { SubSink } from 'subsink'

@Component({
  selector: 'app-audience-filter',
  templateUrl: './audience-filter.component.html',
  styleUrls: ['./audience-filter.component.scss']
})
export class AudienceFilterComponent implements OnInit, OnDestroy {

  @Input('massData')
  set _massData(event) {
    if (event.loginId) {
      this._bindMassfollowing(event)
    } else if (!this.filterAudienceForm) {
      this._initForm()
    }
  }

  public filterAudienceForm: FormGroup
  private _subs = new SubSink();
  constructor(
    private _formBuilder: FormBuilder,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService
  ) { }

  ngOnInit() {

  }

  private _initForm(): void {
    this.filterAudienceForm = this._formBuilder.group({
      followers: this._formBuilder.group({ status: false, min: 0, max: 0 }),
      folowings: this._formBuilder.group({ status: false, min: 0, max: 0 }),
      likeInPhoto: this._formBuilder.group({ status: false, min: 0, max: 0 }),
      postCount: this._formBuilder.group({ status: false, min: 0, max: 0 }),
      haveAvatar: false,
      lastPostAge: this._formBuilder.group({ status: false, age: 0 }),
      lastStoryAge: this._formBuilder.group({ status: false, age: 0 }),
      profileDescription: false,
      haveSite: false,
      descriptionInclude: this._formBuilder.group({ status: '', text: '' }),
      descriptionExclude: this._formBuilder.group({ status: '', text: '' })

    })
    this.filterAudienceForm.valueChanges.subscribe((data) => {
      let filters;
      let formValue = this.filterAudienceForm.value
      filters = {
        followers: formValue.followers.status ? { min: formValue.followers.min, max: formValue.followers.max } : null,
        folowings: formValue.folowings.status ? { min: formValue.folowings.min, max: formValue.folowings.max } : null,
        likeInPhoto: formValue.likeInPhoto.status ? { min: formValue.likeInPhoto.min, max: formValue.likeInPhoto.max } : null,
        postCount: formValue.postCount.status ? { min: formValue.postCount.min, max: formValue.postCount.max } : null,
        haveAvatar: formValue.haveAvatar,
        lastPostAge: formValue.lastPostAge.status ? formValue.lastPostAge.age : 0,
        lasStoryAge: formValue.lastStoryAge.status ? formValue.lastStoryAge.age : 0,
        profileDescription: formValue.profileDescription,
        description: {
          include: formValue.descriptionInclude.status ? formValue.descriptionInclude.text.trim().split(',') : null,
          exclude: formValue.descriptionExclude.status ? formValue.descriptionExclude.text.trim().split(',') : null,
        },
        haveSite: formValue.haveSite,
        // gender?: 'string',
        // language?: 'string',
      }
      this._autoSubscribeOrWatchStoryService.settings.filter = filters
    })
  }

  private _bindMassfollowing(event): void {
    console.log(event);
    this.filterAudienceForm.patchValue({
      followers: { status: event.filter.followers ? true : false, min: event.filter.followers.min || 0, max: event.filter.followers.max || 0 }
    });

  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
