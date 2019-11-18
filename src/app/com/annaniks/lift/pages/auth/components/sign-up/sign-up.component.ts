import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  public signUpForm: FormGroup;
  //private _title = environment.appName;
  private _registerSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // private authService: AuthService
  ) {
    this._redirectIfUserLoggedIn();
  }

  ngOnInit() {
    this._initForm();
  }

  // onSubmit() {
  //   const values = this.signUpForm.value;
  //   const keys = Object.keys(values);

  //   if (this.signUpForm.valid) {
  //     this.registerSubs = this.authService
  //       .register(values)
  //       .pipe(
  //         tap(
  //           _ => _,
  //           user => {
  //             const errors = user.error.errors || {};
  //             keys.forEach(val => {
  //               if (errors[val]) {
  //                 this.pushErrorFor(val, errors[val][0]);
  //               }
  //             });
  //           }
  //         )
  //       )
  //       .subscribe();
  //   } else {
  //     keys.forEach(val => {
  //       const ctrl = this.signUpForm.controls[val];
  //       if (!ctrl.valid) {
  //         this.pushErrorFor(val, null);
  //         ctrl.markAsTouched();
  //       }
  //     });
  //   }
  // }

  private _pushErrorFor(ctrl_name: string, msg: string) {
    this.signUpForm.controls[ctrl_name].setErrors({ msg: msg });
  }

  private _initForm() {
    this.signUpForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(8)]]
    },
      { validator: this._matchingPasswords('password', 'password_confirmation') });
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
    if (this._registerSubs) {
      this._registerSubs.unsubscribe();
    }
  }
}
