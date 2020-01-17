import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { throwError, Subject } from 'rxjs';
import { map, catchError, takeUntil, finalize } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { LoginData } from '../../../../core/models/login';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private _unsubscribe: Subject<void> = new Subject<void>();
  public signInForm: FormGroup;
  public errorMessage: string;
  public loading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router:Router,
    private _cookieService:CookieService
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
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  private _setValidationErrors(keys: string[]): void {
    keys.forEach(val => {
      const ctrl = this.signInForm.controls[val];
      if (!ctrl.valid) {
        this._pushErrorFor(val, null);
        ctrl.markAsTouched();
      }
    });
  }

  private _userLogin(loginData: LoginData): void {
    this.loading = true;
    this._authService.login(loginData)
      .pipe(
        finalize(() => this.loading = false),
        takeUntil(this._unsubscribe),
        map((data) => {
          const tokens = data.data;
          this._cookieService.put('accessToken',tokens.accessToken);
          this._cookieService.put('refreshToken',tokens.refreshToken);
          this._router.navigate(['/statistics/preview']);
        }),
        catchError((err) => {
          this.errorMessage = err.error.message;
          return throwError(err);
        })
      )
      .subscribe()
  }

  public onSubmit(): void {
    const loginData = this.signInForm.value as LoginData;
    const keys = Object.keys(loginData);
    if (this.signInForm.valid) {
      this._userLogin(loginData);
    } else {
      this._setValidationErrors(keys);
    }
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

}
