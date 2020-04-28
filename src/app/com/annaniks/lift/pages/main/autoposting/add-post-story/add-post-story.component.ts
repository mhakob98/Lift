import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutoPostingService } from '../autoposting.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import {
  CreatePostData,
  PostOrStory,
  CreateStoryData
} from '../../../../core/models/autoposting';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'add-post-story-modal',
  templateUrl: './add-post-story.component.html',
  styleUrls: ['./add-post-story.component.scss']
})
export class AddPostStoryComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  private _editable: boolean = false;
  private _type: "story" | "post" = "post";
  public title: string;
  public addPostStoryForm: FormGroup;
  public showEmojies: boolean = false;
  public showCalendar: boolean = false;
  public showComment: boolean = true;
  public localImages: string[] = [];
  public files: File[] = [];
  public loading: boolean = false;
  public errorMessage: string;
  public selectedDate: string = 'Сейчас';
  public userImage: string = '/assets/images/user.png';

  constructor(
    private _dialogRef: MatDialogRef<AddPostStoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    @Inject("FILE_URL") private _fileUrl: string,
    private _formBuilder: FormBuilder,
    private _toastrService: ToastrService,
    private _autopostingService: AutoPostingService,
    private _authService: AuthService,
    private _datePipe: DatePipe
  ) {
    this.title = `Добавить новый ${this.data.type == 'post' ? 'пост' : 'story'}`;
    this._type = this.data.type;
  }

  ngOnInit() {
    this._setUserAvatar();
    this._initForm();
    this._setFormValues();
  }

  private _initForm(): void {
    if (this.data.type == 'post') {
      this.addPostStoryForm = this._formBuilder.group({
        life: this._formBuilder.group({
          status: [false],
          count: [{ value: null, disabled: true }]
        }),
        type_mark: [null, Validators.required],
        showFirstComment: [true],
        comment: [null, Validators.required],
        time: [null]
      })
      this.addPostStoryForm.get('showFirstComment').valueChanges.subscribe((value) => {
        this.showComment = value;
        if (value) {
          this.addPostStoryForm.get('comment').enable();
        }
        else {
          this.addPostStoryForm.get('comment').disable();
        }
      })

    }
    else {
      this.addPostStoryForm = this._formBuilder.group({
        life: this._formBuilder.group({
          status: [false],
          count: [{ value: null, disabled: true }]
        }),
        time: [null]
      })
    }
    this.addPostStoryForm.get('time').valueChanges.subscribe((value) => {
      if (value) {
        this.selectedDate = this._datePipe.transform(value, 'dd/MM/yyyy hh:mm:ss');
      }
    })
    this.addPostStoryForm.get('life').get('status').valueChanges.subscribe((value) => {
      if (value) {
        this.addPostStoryForm.get('life').get('count').enable();
      }
      else {
        this.addPostStoryForm.get('life').get('count').disable();

      }
    })
  }

  private _setUserAvatar(): void {
    const avatar: string = this._authService.getAccount().avatar;
    if (avatar) {
      this.userImage = avatar;
    }
  }

  private _createPost(): void {
    this.loading = true;

    let time: string = this.addPostStoryForm.get('time').value;
    if (time) {
      time = this._datePipe.transform(time, 'yyyy-MM-dd hh:mm:ss');
    }

    let postInfo: CreatePostData = {
      accountId: this._authService.getAccount().id,
      caption: this.addPostStoryForm.get('type_mark').value,
      time: time,
      removeAt: this.addPostStoryForm.get('life').value.status ? this.addPostStoryForm.get('life').value.count : '',
      firstComment: this.addPostStoryForm.get('comment').value,
      photo: this.files[0]
    }
    this._autopostingService.createPost(postInfo)
      .pipe(
        takeUntil(this._unsubscribe$),
        finalize(() => this.loading = false)
      )
      .subscribe((response) => {
        this._toastrService.success('Сохранено');
        this._dialogRef.close({ changed: true });
      },
        (err) => {
          const error = err.error;
          const message = error.message || 'Ошибка';
          this.errorMessage = message;
          this._toastrService.error(message);
        })
  }

  private _createStory(): void {
    this.loading = true;
    const storyInfo: CreateStoryData = {
      accountId: this._authService.getAccount().id,
      time: this.addPostStoryForm.get('time').value,
      removeAt: this.addPostStoryForm.get('life').value.status ? this.addPostStoryForm.get('life').value.count : '',
      photo: this.files[0]
    }
    this._autopostingService.createStory(storyInfo)
      .pipe(
        takeUntil(this._unsubscribe$),
        finalize(() => this.loading = false)
      )
      .subscribe((response) => {
        this._toastrService.success('Сохранено');
        this._dialogRef.close({ changed: true });
      },
        (err) => {
          const error = err.error;
          const message = error.message || 'Ошибка';
          this.errorMessage = message;
          this._toastrService.error(message);
        })
  }

  private _setFormValues(): void {
    this._editable = this.data.editable;
    if (this._editable) {
      const postOrStory: PostOrStory = this.data.event;
      if (postOrStory.date.file) {
        this.localImages.push(`${this._fileUrl}/${postOrStory.date.file.filename}`);
      }
      if (postOrStory.type == 'post') {
        this.title = `Пост ${postOrStory.date.caption}`;
        this.addPostStoryForm.patchValue({
          time: new Date(postOrStory.time),
          showFirstComment: (postOrStory.date.firstComment) ? true : false,
          comment: (postOrStory.date.firstComment) ? postOrStory.date.firstComment : null,
          type_mark: postOrStory.date.caption,
        })
        this.showComment = (postOrStory.date.firstComment) ? true : false;
        if (!this.showComment) {
          this.addPostStoryForm.get('comment').disable();
        }
      }
      if (postOrStory.type == 'story') {
        this.addPostStoryForm.patchValue({
          time: new Date(postOrStory.time),
        })
      }
      if (postOrStory.date.removeAt) {
        try {
          const count: number = +JSON.parse(postOrStory.date.removeAt)
          if (count) {
            this.addPostStoryForm.get('life').patchValue({
              count: count,
              status: true
            })
            this.addPostStoryForm.get('life').get('count').enable();
          }
        } catch (error) { }
      }
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

  public onClickShowCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  public onClickRemove(): void {
    this.localImages = [];
    this.files = [];
  }

  public onClickCreate(): void {
    if (!this.loading && this.addPostStoryForm.valid) {
      if (this._type == 'post')
        this._createPost();
      if (this._type == 'story')
        this._createStory();
    }
  }

  public toggleShowEmojies(): void {
    this.showEmojies = !this.showEmojies
  }

  public onClickCancel(): void {
    this._dialogRef.close({ changed: false });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
