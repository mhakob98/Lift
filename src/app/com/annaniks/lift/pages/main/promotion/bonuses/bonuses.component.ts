import { Component, OnInit } from '@angular/core';
import { BonusesService } from './bonuses.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-bonuses',
  templateUrl: './bonuses.component.html',
  styleUrls: ['./bonuses.component.scss']
})
export class BonusesComponent implements OnInit {

  public bonuses$ = this._bonusesService.fetchAllBonuses$
    .pipe(catchError(of))

  constructor(private _bonusesService: BonusesService) { }

  ngOnInit() {
  }

}
