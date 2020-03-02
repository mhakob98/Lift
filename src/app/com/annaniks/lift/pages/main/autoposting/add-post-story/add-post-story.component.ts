import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutoPostingService } from '../autoposting.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { CreatePostData } from '../../../../core/models/autoposting';

@Component({
  selector: 'add-post-story-modal',
  templateUrl: './add-post-story.component.html',
  styleUrls: ['./add-post-story.component.scss']
})
export class AddPostStoryComponent implements OnInit {

  private _unsubscribe$: Subject<void> = new Subject<void>();
  public addPostStoryForm: FormGroup;
  public showEmojies: boolean = false;
  public localImages: string[] = [];
  public files: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddPostStoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _formBuilder: FormBuilder,
    private _autopostingService: AutoPostingService,
    private _authService: AuthService
  ) { }


  ngOnInit() {
    this._initForm()
  }

  private _initForm(): void {
    if (this.data.type == 'post') {
      this.addPostStoryForm = this._formBuilder.group({
        postLife: this._formBuilder.group({ status: false, count: 10, age: 10 }),
        type_mark: ['', Validators.required],
        showFirstComment: true,
        time: new Date(Date.now())
      })
    }
    else {
      this.addPostStoryForm = this._formBuilder.group({
        stoyLife: this._formBuilder.group({ status: false, count: 10 }),
        tim: new Date(Date.now())
      })
    }
  }

  public onSelectFiles($event): void {
    this.files = [];
    if ($event) {
      const fileList: FileList = $event.target.files;
      if (fileList) {
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          this.files.push(file);
          const reader: FileReader = new FileReader();
          reader.onload = (e: any) => {
            this.localImages.push(e.target.result.toString());
          }
          reader.readAsDataURL(file);
        }
      }
    }
  }

  public createPost(): void {
    let postInfo: CreatePostData = {
      accountId: this._authService.getAccount().id,
      caption: this.addPostStoryForm.get('type_mark').value,
      time: this.addPostStoryForm.get('time').value,
      removeAt: this.addPostStoryForm.get('postLife').value.status ? this.addPostStoryForm.get('postLife').value.count : '',
      // firstComment: this.addPostStoryForm.get('').value,
      photo: this.files[0]
    }
    this._autopostingService.createPost(postInfo)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(response => {
        console.log(response);

      })
  }

  public toggleShowEmojies(): void {
    this.showEmojies = !this.showEmojies
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
