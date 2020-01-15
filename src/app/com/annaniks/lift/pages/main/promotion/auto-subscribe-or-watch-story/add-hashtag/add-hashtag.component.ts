import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-hashtag',
  templateUrl: './add-hashtag.component.html',
  styleUrls: ['./add-hashtag.component.scss']
})
export class AddHashtagComponent implements OnInit {
  public hashtagsForm: FormGroup;
  public hashtagsItems: FormArray;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this._formBuilder()
  }

  private _formBuilder(): void {
    this.hashtagsForm = this._fb.group({
      items: this._fb.array([this.createItem()])
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
}
