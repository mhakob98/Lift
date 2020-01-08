import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SubSink } from 'subsink';
import { AccountSettingsService } from '../../account-settings.service';
import { AccountProfileSettings } from 'src/app/com/annaniks/lift/core/models/account-profile-settings';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {

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
    const values = this.mainSettings.value as AccountProfileSettings;
    const keys = Object.keys(values);

    if (this.mainSettings.valid) {
      this._subs.add(
        this._accountSettingsService
          .saveProfileSettings(values)
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
    this.mainSettings = this._fb.group({});
  }
}
