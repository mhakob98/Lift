import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountConnectionModal } from '../../../../core/modals';

@Component({
  selector: 'app-header-switch-account',
  templateUrl: './header-switch-account.component.html',
  styleUrls: ['./header-switch-account.component.scss']
})
export class HeaderSwitchAccountComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  public openAccontConnectionModal(): void {
    const dialogRef = this.dialog.open(AccountConnectionModal, {
      width: "700px",
    })
  }

}
