import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  templateUrl: './add-post-story.component.html',
  styleUrls: ['./add-post-story.component.scss']
})
export class AddPostStoryComponent implements OnInit {
  public addPostStoryForm: FormGroup
  public showEmojies: boolean = false
  constructor(
    public dialogRef: MatDialogRef<AddPostStoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string },
    private _formBuilder: FormBuilder
  ) { }


  ngOnInit() {
    this._initForm()
  }

  private _initForm(): void {
    if (this.data.type == 'post') {
      this.addPostStoryForm = this._formBuilder.group({
        postLife: this._formBuilder.group({ status: false, count: 10 }),
        showFirstComment: true,
      })
    }
    else {
      this.addPostStoryForm = this._formBuilder.group({
        storyLife: this._formBuilder.group({ status: false, count: 10 }),
      })
    }
    console.log(this.addPostStoryForm);

  }

  public toggleShowEmojies(): void {
    this.showEmojies = !this.showEmojies
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
