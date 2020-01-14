import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public showNots: boolean = false;
  public showQuestion: boolean = false;
  public showUserDetails: boolean = false;
  public showSwitchAccount: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  public toggleNotsPanel(): void {
    this.showNots = !this.showNots
  }

  public toggleQuestions(): void {
    this.showQuestion = !this.showQuestion
  }

  public toggleUserDetails(): void {
    this.showUserDetails = !this.showUserDetails
  }

  public toggleSwitchAccount(): void {
    this.showSwitchAccount = !this.showSwitchAccount
  }

  public onClickedOutsideNots(): void {
    this.showNots = false;
  }

  public onClickedOutsideQuestions(): void {
    this.showQuestion = false
  }

  public onClickedOutsideUserDetails(): void {
    this.showUserDetails = false;
  }

  public onClickedOutsideSwitch(): void {
    this.showSwitchAccount = false;
  }
}
