import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SubSink } from 'subsink';
import { AccountSettingsService } from '../../account-settings.service';
import { AccountContactSettings } from 'src/app/com/annaniks/lift/core/models/account-contact-settings';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-contacts-settings',
  templateUrl: './contacts-settings.component.html',
  styleUrls: ['./contacts-settings.component.scss']
})
export class ContactsSettingsComponent implements OnInit {

  public contactsSettingsForm: FormGroup;
  private _subs = new SubSink();

  constructor(
    private _fb: FormBuilder,
    private _accountSettingsService: AccountSettingsService,
  ) { }

  ngOnInit() {
    this._initForm();
  }

  onSubmit() {
    const values = this.contactsSettingsForm.value as AccountContactSettings;
    const keys = Object.keys(values);

    if (this.contactsSettingsForm.valid) {
      this._subs.add(
        this._accountSettingsService
          .saveContactSettings(values)
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
        const ctrl = this.contactsSettingsForm.controls[val];
        if (!ctrl.valid) {
          this._pushErrorFor(val, null);
          ctrl.markAsTouched();
        }
      });
    }
  }

  private _pushErrorFor(ctrlName: string, msg: string): void {
    this.contactsSettingsForm.controls[ctrlName].setErrors({ msg: msg });
  }


  private _initForm(): void {
    this.contactsSettingsForm = this._fb.group({});
  }
}
