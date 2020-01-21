import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountConnectionModal } from '../../../../core/modals';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header-switch-account',
  templateUrl: './header-switch-account.component.html',
  styleUrls: ['./header-switch-account.component.scss']
})
export class HeaderSwitchAccountComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private _authService: AuthService
  ) { }

  ngOnInit() {
  }

  public openAccontConnectionModal(): void {
    const dialogRef = this.dialog.open(AccountConnectionModal, {
      width: "700px",
    })
  }

  public setAccount(index: number): void {
    this._authService.setAccount(index)
  }

  get getUserInfo(): any {
    return this._authService.getUserStateSync().istagramAccounts
  }
}
