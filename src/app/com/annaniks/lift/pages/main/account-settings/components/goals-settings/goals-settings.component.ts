import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SubSink } from 'subsink';
import { AccountSettingsService } from '../../account-settings.service';
import { tap } from 'rxjs/operators';
import { AccountGoalSettings } from 'src/app/com/annaniks/lift/core/models/account-goal-settings';

@Component({
  selector: 'app-goals-settings',
  templateUrl: './goals-settings.component.html',
  styleUrls: ['./goals-settings.component.scss']
})
export class GoalsSettingsComponent implements OnInit {

  public goalsSettings: FormGroup;
  private _subs = new SubSink();

  constructor(
    private _fb: FormBuilder,
    private _accountSettingsService: AccountSettingsService,
  ) { }

  ngOnInit() {
    this._initForm();
  }

  onSubmit() {
    const values = this.goalsSettings.value as AccountGoalSettings;
    const keys = Object.keys(values);

    if (this.goalsSettings.valid) {
      this._subs.add(
        this._accountSettingsService
          .saveGoalSettings(values)
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
        const ctrl = this.goalsSettings.controls[val];
        if (!ctrl.valid) {
          this._pushErrorFor(val, null);
          ctrl.markAsTouched();
        }
      });
    }
  }

  private _pushErrorFor(ctrlName: string, msg: string): void {
    this.goalsSettings.controls[ctrlName].setErrors({ msg: msg });
  }


  private _initForm(): void {
    this.goalsSettings = this._fb.group({});
  }
}
