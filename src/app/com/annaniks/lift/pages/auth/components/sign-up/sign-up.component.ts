import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { AuthService } from '../../auth.service';
import { tap } from 'rxjs/operators';
import { BasicUser } from '../../../../core/models/basic-user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  public signUpForm: FormGroup;
  private _subs = new SubSink();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this._redirectIfUserLoggedIn();
  }

  ngOnInit() {
    this._initForm();
  }

  onSubmit() {
    const form = this.signUpForm.value
    const values: BasicUser = {
      name: form.name,
      email: form.email,
      password: form.password,
    }
    const keys = Object.keys(values);

    if (this.signUpForm.valid) {
      this._subs.add(
        this.authService
          .register(values)
          .pipe(
            tap(
              _ => _,
              user => {
                console.log(user);

                const errors = user.error.errors || {};
                keys.forEach(val => {
                  if (errors[val]) {
                    this._pushErrorFor(val, errors[val][0]);
                  }
                });
              }
            )
          )
          .subscribe()
      )
    } else {
      keys.forEach(val => {
        const ctrl = this.signUpForm.controls[val];
        if (!ctrl.valid) {
          this._pushErrorFor(val, null);
          ctrl.markAsTouched();
        }
      });
    }
  }

  private _pushErrorFor(ctrl_name: string, msg: string) {
    this.signUpForm.controls[ctrl_name].setErrors({ msg: msg });
  }

  private _initForm() {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(8)]]
    },
      { validator: this._matchingPasswords('password', 'passwordConfirmation') });
  }

  private _redirectIfUserLoggedIn(): void {

  }


  private _matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: boolean } | null => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }


  ngOnDestroy() {
    this._subs.unsubscribe()
  }
}
