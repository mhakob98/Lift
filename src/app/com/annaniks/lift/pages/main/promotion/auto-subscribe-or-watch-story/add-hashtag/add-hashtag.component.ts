import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SubSink } from 'subsink';
import { AutoSubscribeOrWatchStoryService } from '../auto-subscribe-watch-story.service';
import { SearchTerm, Search } from 'src/app/com/annaniks/lift/core/models/search';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-hashtag',
  templateUrl: './add-hashtag.component.html',
  styleUrls: ['./add-hashtag.component.scss']
})
export class AddHashtagComponent implements OnInit {

  @Output('searched')
  private _searched = new EventEmitter<SearchTerm>();

  @Input('searchValue')
  public searchValue: Observable<Search>

  public hashtag: string;
  public hashtagsForm: FormGroup;
  public hashtagsItems: FormArray;
  private _subs = new SubSink();

  constructor(
    private _fb: FormBuilder,
    private _subscribeStoryService: AutoSubscribeOrWatchStoryService
  ) { }

  ngOnInit() {
    this._formBuilder()
  }

  private _formBuilder(): void {
    this.hashtagsForm = this._fb.group({
      items: this._fb.array([])
    });
  }

  public search(event): void {
    this._searched.emit({ type: "hashtag", query: event.query })
  }

  public createItem(): FormGroup {
    return this._fb.group({ label: '' });
  }

  public addItem(): void {
    this.hashtagsItems = this.hashtagsForm.get('items') as FormArray;
    this.hashtagsItems.push(this.createItem());
  }

  public deleteHashtag(hashtagIndex: number): void {
    this.hashtagsItems.removeAt(hashtagIndex)
  }

  public clearAll(): void {
    while (this.hashtagsItems.length !== 0) {
      this.hashtagsItems.removeAt(0)
    }
  }
  public writeValueToService(): void {
    let hashtags = [];
    this.hashtagsForm.value.items.map((hashtag) => {
      hashtags.push(hashtag.label)
    });
    this._subscribeStoryService.selectedHashtags = hashtags
  }

  get itemsControl(): FormArray {
    return this.hashtagsForm.get('items') as FormArray;
  }
}
