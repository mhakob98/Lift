import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { map, catchError, finalize } from 'rxjs/operators';
import { MatchPassword } from '../../../../core/utilities/match-password';
import { Subject, throwError } from 'rxjs';
import { RegisterData } from '../../../../core/models/register';
import { ServerResponse } from '../../../../core/models/server-response';
import { TokenResponse } from '../../../../core/models/auth';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  private _matchPassword: MatchPassword = new MatchPassword();
  private _unsubscribe: Subject<void> = new Subject<void>();
  public signUpForm: FormGroup;
  public loading: boolean = false;
  public errorMessage:string;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _cookieService:CookieService
  ) { }

  ngOnInit() {
    this._initForm();
  }

  private _pushErrorFor(ctrl_name: string, msg: string): void {
    this.signUpForm.controls[ctrl_name].setErrors({ msg: msg });
  }

  private _initForm(): void {
    this.signUpForm = this._fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]]
    },
      { validator: this._matchPassword.check('password', 'passwordConfirmation') });
  }

  private _userRegister(registerData: RegisterData): void {
    this.loading = true;
    this._authService
      .register(registerData)
      .pipe(
        finalize(() => this.loading = false),
        map((data:ServerResponse<TokenResponse>) => {
          this.errorMessage = undefined;
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
    const form = this.signUpForm.value
    const values: RegisterData = {
      name: form.name,
      email: form.email,
      password: form.password,
    }
    const keys = Object.keys(values);
    if (this.signUpForm.valid) {
      this._userRegister(values);
    } else {
      this._setValidatonErrors(keys);
    }
  }

  private _setValidatonErrors(keys: string[]): void {
    keys.forEach(val => {
      const ctrl = this.signUpForm.controls[val];
      if (!ctrl.valid) {
        this._pushErrorFor(val, null);
        ctrl.markAsTouched();
      }
    });
  }


  public getValidationError(field: string, errorName: string): boolean {
    return this.signUpForm.get(field).hasError(errorName) && this.signUpForm.get(field).touched;
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
