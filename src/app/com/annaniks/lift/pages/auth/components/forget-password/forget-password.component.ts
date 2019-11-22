
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  public forgetPasswordForm: FormGroup;
  private _subs = new SubSink();

  constructor(
    private _fb: FormBuilder,
    // private authService: AuthService
  ) { }

  ngOnInit() {
    this._initForm();
  }

  // onSubmit() {
  //   const values = this.forgetPasswordForm.value;
  //   const keys = Object.keys(values);

  //   if (this.forgetPasswordForm.valid) {
  //     this._subs.add(
  //       this.authService
  //         .forgetPassword(values)
  //         .pipe(
  //           tap(
  //             noop,
  //             user => {
  //               const errors = user.error.error || 'Something went wrong';
  //               keys.forEach(val => {
  //                 this._pushErrorFor(val, errors);
  //               });
  //             }
  //           )
  //         )
  //         .subscribe();
  //     )

  //   } else {
  //     keys.forEach(val => {
  //       const ctrl = this.forgetPasswordForm.controls[val];
  //       if (!ctrl.valid) {
  //         this._pushErrorFor(val, null);
  //         ctrl.markAsTouched();
  //       }
  //     });
  //   }
  // }

  private _pushErrorFor(ctrl_name: string, msg: string): void {
    this.forgetPasswordForm.controls[ctrl_name].setErrors({ msg: msg });
  }

  private _initForm(): void {
    this.forgetPasswordForm = this._fb.group({
      email: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this._subs.unsubscribe()
  }
}
