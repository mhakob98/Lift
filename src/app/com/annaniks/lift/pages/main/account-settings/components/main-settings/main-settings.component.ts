import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountSettingsService } from '../../account-settings.service';
import { SubSink } from 'subsink';
import { AccountMainSettings } from 'src/app/com/annaniks/lift/core/models/account-main-settings';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-main-settings',
  templateUrl: './main-settings.component.html',
  styleUrls: ['./main-settings.component.scss']
})
export class MainSettingsComponent implements OnInit, OnDestroy {

  public mainSettings: FormGroup;
  private _subs = new SubSink();

  constructor(
    private _fb: FormBuilder,
    private _accountSettingsService: AccountSettingsService,
  ) { }

  ngOnInit() {
    this._initForm();
  }

  onSubmit() {
    const values = this.mainSettings.value as AccountMainSettings;
    const keys = Object.keys(values);

    if (this.mainSettings.valid) {
      this._subs.add(
        this._accountSettingsService
          .saveMainSettings(values)
          .pipe(
            tap(
              _ => _,
              error => {
                const errors = error.error.error || 'invalid email or password';
                keys.forEach(val => {
                  this._pushErrorFor(val, errors);
                });
              }
            )
          )
          .subscribe()
      )
    } else {
      keys.forEach(val => {
        const ctrl = this.mainSettings.controls[val];
        if (!ctrl.valid) {
          this._pushErrorFor(val, null);
          ctrl.markAsTouched();
        }
      });
    }
  }

  private _pushErrorFor(ctrlName: string, msg: string): void {
    this.mainSettings.controls[ctrlName].setErrors({ msg: msg });
  }

  private _initForm(): void {
    this.mainSettings = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      firstName: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

}
