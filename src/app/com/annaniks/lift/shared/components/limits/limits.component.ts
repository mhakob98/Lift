import { Component, OnInit, Input } from '@angular/core';
import { Limits } from '../../../core/models/limits';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-limits',
  templateUrl: './limits.component.html',
  styleUrls: ['./limits.component.scss']
})
export class LimitsComponent implements OnInit {

  @Input()
  limits: Limits

  constructor(private _authService: AuthService) { }

  ngOnInit() {

  }

  get userLogin(): string {
    return this._authService.getAccount().login;
  }

}
