import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public signInForm: FormGroup;
  // private _title = environment.appName;
  private _loginSubs: Subscription;

  constructor(
    private _fb: FormBuilder,
    // private authService: AuthService,
  ) {
    this._redirectIfUserLoggedIn();
  }

  ngOnInit() {
    this._initForm();
  }

  // onSubmit() {
  //   const values = this.signInForm.value;
  //   const keys = Object.keys(values);

  //   if (this.signInForm.valid) {
  //     this.loginSubs = this.authService
  //       .login(values)
  //       .pipe(
  //         tap(
  //           _ => _,
  //           error => {
  //             const errors = error.error.error || 'invalid email or password';
  //             keys.forEach(val => {
  //               this.pushErrorFor(val, errors);
  //             });
  //           }
  //         )
  //       )
  //       .subscribe();
  //   } else {
  //     keys.forEach(val => {
  //       const ctrl = this.signInForm.controls[val];
  //       if (!ctrl.valid) {
  //         this.pushErrorFor(val, null);
  //         ctrl.markAsTouched();
  //       }
  //     });
  //   }
  // }

  private _pushErrorFor(ctrl_name: string, msg: string): void {
    this.signInForm.controls[ctrl_name].setErrors({ msg: msg });
  }

  private _initForm(): void {
    const email = '';
    const password = '';

    this.signInForm = this._fb.group({
      email: [email, Validators.required],
      password: [password, Validators.required]
    });
  }

  private _redirectIfUserLoggedIn(): void {

  }

  ngOnDestroy() {
    if (this._loginSubs) {
      this._loginSubs.unsubscribe();
    }
  }

}
