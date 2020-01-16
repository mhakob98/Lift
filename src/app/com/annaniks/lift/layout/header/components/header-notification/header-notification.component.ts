import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-notification',
  templateUrl: './header-notification.component.html',
  styleUrls: ['./header-notification.component.scss']
})
export class HeaderNotificationComponent implements OnInit {
  public showNots: boolean = false;
  
  constructor() { }

  ngOnInit() {
  }

}
