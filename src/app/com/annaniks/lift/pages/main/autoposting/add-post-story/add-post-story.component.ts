import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutoPostingService } from '../autoposting.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { CreatePostData } from '../../../../core/models/autoposting';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'add-post-story-modal',
  templateUrl: './add-post-story.component.html',
  styleUrls: ['./add-post-story.component.scss']
})
export class AddPostStoryComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
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
    private _formBuilder: FormBuilder,
    private _toastrService: ToastrService,
    private _autopostingService: AutoPostingService,
    private _authService: AuthService,
    private _datePipe: DatePipe
  ) { }


  ngOnInit() {
    this._setUserAvatar();
    this._initForm();
  }

  private _initForm(): void {
    if (this.data.type == 'post') {
      this.addPostStoryForm = this._formBuilder.group({
        postLife: this._formBuilder.group({ status: false, count: 10, age: 10 }),
        type_mark: [null, Validators.required],
        showFirstComment: [true],
        comment: [null, Validators.required],
        time: [null]
      })
      this.addPostStoryForm.get('time').valueChanges.subscribe((value) => {
        if (value) {
          this.selectedDate = this._datePipe.transform(value, 'dd/MM/yyyy hh:mm:ss');
        }
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
        stoyLife: this._formBuilder.group({ status: false, count: 10 }),
        time: new Date()
      })
    }
  }

  private _setUserAvatar(): void {
    const avatar: string = this._authService.getAccount().avatar;
    if (avatar) {
      this.userImage = avatar;
    }
  }

  private _createPost(): void {
    this.loading = true;
    let postInfo: CreatePostData = {
      accountId: this._authService.getAccount().id,
      caption: this.addPostStoryForm.get('type_mark').value,
      time: this.addPostStoryForm.get('time').value,
      removeAt: this.addPostStoryForm.get('postLife').value.status ? this.addPostStoryForm.get('postLife').value.count : '',
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
        this._dialogRef.close({changed:true});
      },
        (err) => {
          const error = err.error;
          const message = error.message || 'Ошибка';
          this.errorMessage = message;
          this._toastrService.error(message);
        })
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

  public onClickCreatePost(): void {
    if (!this.loading && this.addPostStoryForm.valid) {
      this._createPost();
    }
  }

  public toggleShowEmojies(): void {
    this.showEmojies = !this.showEmojies
  }

  public onClickCancel(): void {
    this._dialogRef.close({ changed: false });
  }

  ngOnDestroy() {

  }
}
