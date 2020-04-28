import { Component, OnInit, Input } from '@angular/core';
import { Limits } from '../../../core/models/limits';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-limits',
  templateUrl: './limits.component.html',
  styleUrls: ['./limits.component.scss']
})
export class LimitsComponent implements OnInit {
  public limits: Limits;

  @Input('limits')
  set _limits($event) {
    this.limits = $event;
  }

  constructor(private _authService: AuthService) { }

  ngOnInit() { }

  get userLogin(): string {
    return this._authService.getAccount().login;
  }

  get perHourProgress(): number {
    if (this.limits) {
      return (100 * this.limits.subscribersForHour) / 40; //max = 40
    }
    return 0;
  }

  get perDayProgress(): number {
    if (this.limits) {
      return (100 * this.limits.subscribersForDay) / 120; //max = 120
    }
    return 0;
  }

}
