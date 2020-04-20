import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BonusesService } from './bonuses.service';
import { catchError, takeUntil, finalize } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { BonusSettings } from '../../../../core/models/bonus-settings';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingService } from '../../../../core/services/loading-service';

@Component({
  selector: 'app-bonuses',
  templateUrl: './bonuses.component.html',
  styleUrls: ['./bonuses.component.scss']
})
export class BonusesComponent implements OnInit, OnDestroy {

  public bonusesForm: FormGroup;
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public isUploaded: boolean = true;
  files: string[];
  @ViewChild('fileInput', { static: false }) fileInput;

  constructor(
    private _bonusesService: BonusesService,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _loadingService: LoadingService
  ) { }

  ngOnInit() {
    this._initForm();
    this._getCurrentBonuses();
  }

  private _initForm(): void {
    this.bonusesForm = this._fb.group({
      comment: [null],
      like: [null],
      save: [null],
      commentStatus: [false],
      likeStatus: [false],
      saveStatus: [false],
      comments: [null]
    });
  }

  public addActivity(): void {
    this._loadingService.showLoading();
    const bonusesForm = this.bonusesForm.value;
    const sendingData: BonusSettings = {
      instagramAccountId: this._authService.getAccount().id,
      comment: bonusesForm.commentStatus ? bonusesForm.comment : 0,
      like: bonusesForm.likeStatus ? bonusesForm.like : 0,
      save: bonusesForm.saveStatus ? bonusesForm.save : 0,
      comments: {
        list: this.isUploaded ? this.files : bonusesForm.comments.split(';')
      }
    }
    this._bonusesService.saveBonusesConfig(sendingData).pipe(
      finalize(() => this._loadingService.hideLoading()),
      takeUntil(this._unsubscribe$)
    ).subscribe(response => {
      console.log(response);
      this._bindCurrentState(response.data);
    })
  }

  private _getCurrentBonuses(): void {
    this._loadingService.showLoading();
    this._bonusesService.getBonusesConfig(this._authService.getAccount().id).pipe(
      finalize(() => this._loadingService.hideLoading()),
      takeUntil(this._unsubscribe$)
    ).subscribe((response) => {
      this._bindCurrentState(response.data)
    })
  }

  private _bindCurrentState(value: BonusSettings): void {
    this.bonusesForm.patchValue({
      comment: value.comment,
      like: value.like,
      save: value.save,
      commentStatus: value.comment > 0 ? true : false,
      likeStatus: value.like > 0 ? true : false,
      saveStatus: value.save > 0 ? true : false,
    })
    this.files = value.comments.list
  }

  public handleInputChange(e): void {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /text.*/;
    if (!file.type.match(pattern)) {
      alert(`Можно загружать только файлы в формате 'txt'`);
      return;
    }
    const formData: FormData = new FormData();
    formData.append('txt', file, file.name);
    this._uploadTxt(formData)
  }

  private _uploadTxt(file: FormData): void {
    this._loadingService.showLoading();
    this._bonusesService.uploadTxt(file).pipe(
      finalize(() => this._loadingService.hideLoading()),
      takeUntil(this._unsubscribe$)
    ).subscribe((data) => {
      this.files = [...data.data]
      this.fileInput.nativeElement.value = '';
      this.isUploaded = true
    })
  }

  public toggleIsUploaded(): void {
    this.isUploaded = !this.isUploaded
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
