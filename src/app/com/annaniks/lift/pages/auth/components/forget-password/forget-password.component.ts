
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, noop } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  public forgetPasswordForm: FormGroup;
  private _forgetPasswordSubs: Subscription;

  constructor(
    private _fb: FormBuilder,
    // private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  // onSubmit() {
  //   const values = this.forgetPasswordForm.value;
  //   const keys = Object.keys(values);

  //   if (this.forgetPasswordForm.valid) {
  //     this._forgetPasswordSubs = this.authService
  //       .forgetPassword(values)
  //       .pipe(
  //         tap(
  //           noop,
  //           user => {
  //             const errors = user.error.error || 'Something went wrong';
  //             keys.forEach(val => {
  //               this.pushErrorFor(val, errors);
  //             });
  //           }
  //         )
  //       )
  //       .subscribe();
  //   } else {
  //     keys.forEach(val => {
  //       const ctrl = this.forgetPasswordForm.controls[val];
  //       if (!ctrl.valid) {
  //         this.pushErrorFor(val, null);
  //         ctrl.markAsTouched();
  //       }
  //     });
  //   }
  // }

  private pushErrorFor(ctrl_name: string, msg: string) {
    this.forgetPasswordForm.controls[ctrl_name].setErrors({ msg: msg });
  }

  initForm() {
    const email = '';

    this.forgetPasswordForm = this._fb.group({
      email: [email, Validators.required]
    });
  }

  ngOnDestroy() {
    if (this._forgetPasswordSubs) {
      this._forgetPasswordSubs.unsubscribe();
    }
  }
}
