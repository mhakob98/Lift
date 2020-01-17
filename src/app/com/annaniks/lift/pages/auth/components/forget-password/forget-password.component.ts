
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

  constructor(
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this._initForm();
  }

  private _initForm(): void {
    this.forgetPasswordForm = this._fb.group({
      email: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    
  }
}
