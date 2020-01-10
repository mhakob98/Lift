import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public showNots: boolean = false;
  public showUserDetails: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  public toggleNotsPanel(): void {
    this.showNots = !this.showNots
  }

  public toggleUserDetails(): void {
    this.showUserDetails = !this.showUserDetails
  }

  public onClickedOutsideNots(): void {
    this.showNots = false;
  }
}
