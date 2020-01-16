import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SubSink } from 'subsink';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';

@Component({
  selector: 'app-add-hashtag',
  templateUrl: './add-hashtag.component.html',
  styleUrls: ['./add-hashtag.component.scss']
})
export class AddHashtagComponent implements OnInit {
  public hashtagsForm: FormGroup;
  public hashtagsItems: FormArray;
  private _subs = new SubSink();

  constructor(
    private _fb: FormBuilder,
    private _subscribeStoryService: AutoSubscribeOrWatchStoryService
  ) { }

  ngOnInit() {
    this._formBuilder()
    this._waitForValueEmit()
  }

  private _formBuilder(): void {
    this.hashtagsForm = this._fb.group({
      items: this._fb.array([])
    });
  }

  public createItem(): FormGroup {
    return this._fb.group({ label: '' });
  }

  public addItem(): void {
    this.hashtagsItems = this.hashtagsForm.get('items') as FormArray;
    this.hashtagsItems.push(this.createItem());
  }

  public deleteHashtag(hashtagLabel: string): void {
    this.hashtagsItems.removeAt(this.hashtagsItems.value.filter(hashtag => hashtag === hashtagLabel))
  }

  public clearAll(): void {
    while (this.hashtagsItems.length !== 0) {
      this.hashtagsItems.removeAt(0)
    }
  }
  private _waitForValueEmit(): void {
    this._subs.add(this._subscribeStoryService.saveSettingsObservable$.subscribe(async (data) => {
      console.log(this.hashtagsForm.value);
      await data
      let hashtags: string[] = []
      this.hashtagsForm.value.items.map((hashtag: { label: string }) => {
        hashtags.push(hashtag.label)
      })
      this._subscribeStoryService.hashtagSubject$.next(hashtags)
    }))
  }
}
