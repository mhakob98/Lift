import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountConnectionModal } from '../../../../core/modals';
import { InstagramAccount } from '../../../../core/models/user';
import { MainService } from '../../../../pages/main/main.service';

@Component({
  selector: 'app-header-switch-account',
  templateUrl: './header-switch-account.component.html',
  styleUrls: ['./header-switch-account.component.scss']
})
export class HeaderSwitchAccountComponent implements OnInit {
  @Input('userAccounts') public userAccounts: InstagramAccount[] = [];
  @Output('selectAccount') public selectAccount: EventEmitter<InstagramAccount> = new EventEmitter<InstagramAccount>();
  public selectedAccount: InstagramAccount;

  constructor(
    private _dialog: MatDialog,
    private _mainService: MainService
  ) { }

  ngOnInit() {
  }

  public openAccountConnectionModal(): void {
    const dialogRef = this._dialog.open(AccountConnectionModal, {
      width: "700px",
      data: {
        isFirstAccount: false
      }
    })
    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.isAccountConnected) {
        this._mainService.getMe().subscribe();
      }
    })
  }

  public onClickAccount(item: InstagramAccount): void {
    if (this.selectedAccount && item.id === this.selectedAccount.id) return;

    this.selectedAccount = item;
    this.selectAccount.emit(this.selectedAccount);
  }

}
