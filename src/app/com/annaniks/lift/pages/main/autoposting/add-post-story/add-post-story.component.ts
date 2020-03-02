import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'add-post-story-modal',
  templateUrl: './add-post-story.component.html',
  styleUrls: ['./add-post-story.component.scss']
})
export class AddPostStoryComponent implements OnInit {
  public addPostStoryForm: FormGroup;
  public showEmojies: boolean = false;
  public localImages: string[] = [];
  public files: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddPostStoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _formBuilder: FormBuilder
  ) {
  }


  ngOnInit() {
    this._initForm()
  }

  private _initForm(): void {
    if (this.data.type == 'post') {
      this.addPostStoryForm = this._formBuilder.group({
        postLife: this._formBuilder.group({ status: false, count: 10, age: 10 }),
        showFirstComment: true,
      })
    }
    else {
      this.addPostStoryForm = this._formBuilder.group({
        storyLife: this._formBuilder.group({ status: false, count: 10 }),
      })
    }
  }

  public onSelectFiles($event): void {
    this.files = [];
    if ($event) {
      const fileList: FileList = $event.target.files;
      if (fileList) {
        for (let i = 0; i < fileList.length - 1; i++) {
          const file = fileList[i];
          this.files.push(file);
          const reader: FileReader = new FileReader();
          reader.onload = (e:any) => {
            this.localImages.push(e.target.result.toString());
          }
          reader.readAsDataURL(file);
        }

      }
    }
  }

  public toggleShowEmojies(): void {
    this.showEmojies = !this.showEmojies
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
