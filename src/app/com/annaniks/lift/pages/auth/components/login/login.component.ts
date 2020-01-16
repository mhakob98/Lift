import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { AuthService } from '../../auth.service';
import { LoginData } from '../../../../core/models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public signInForm: FormGroup;
  private _subs = new SubSink();

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
  ) { }

  ngOnInit() {
    this._initForm();
  }


  private _pushErrorFor(ctrl_name: string, msg: string): void {
    this.signInForm.controls[ctrl_name].setErrors({ msg: msg });
  }

  private _initForm(): void {
    this.signInForm = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    const loginData = this.signInForm.value as LoginData;
    const keys = Object.keys(loginData);
    if (this.signInForm.valid) {
      this._subs.add(
        this._authService
          .login(loginData)
          .pipe(
            tap(
              data => {
                console.log(data);
              },
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
        const ctrl = this.signInForm.controls[val];
        if (!ctrl.valid) {
          this._pushErrorFor(val, null);
          ctrl.markAsTouched();
        }
      });
    }
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

}
