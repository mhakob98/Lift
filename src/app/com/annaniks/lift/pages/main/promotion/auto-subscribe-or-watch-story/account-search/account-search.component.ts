import { Component, OnInit, Input } from '@angular/core';
import { AccountSearchParam } from '../../../../../core/models/subscription-parameter';

@Component({
  selector: 'app-account-search',
  templateUrl: './account-search.component.html',
  styleUrls: ['./account-search.component.scss']
})
export class AccountSearchComponent implements OnInit {
  @Input('type') public type: AccountSearchParam;
  public texts: string[];

  public results: string[];

  public searchArray: string[] = [
    "barev", "hajox", "Hovo", "Rado", "hakov"
  ]

  constructor() { }

  ngOnInit() {
  }

  public search(event): void {
    this.results = this.searchArray.filter((d) => d.includes(event.query))
  }
  public clearAll(): void {
    this.texts = []
  }
}
