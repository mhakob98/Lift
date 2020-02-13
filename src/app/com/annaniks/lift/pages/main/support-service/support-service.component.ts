import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionComponent } from './add-question/add-question.component';
import { Subject } from 'rxjs';
import { SupportService } from './support-service.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Ticket } from '../../../core/models/support-service';
import { MainService } from '../main.service';
import { SupportTicketStatus, SupportTicketCategory } from '../../../core/models/account-settings';

@Component({
  selector: 'app-support-service',
  templateUrl: './support-service.component.html',
  styleUrls: ['./support-service.component.scss']
})
export class SupportServiceComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public loading: boolean = false;
  public openedTickets: Ticket[] = [];
  public closedTickets: Ticket[] = [];
  public open: boolean = false;

  constructor(
    private _matDialog: MatDialog,
    private _supportService: SupportService,
  ) { }

  ngOnInit() {
    this._getAllTickets();
  }

  private _getAllTickets(): void {
    this.loading = true;
    this._supportService.getAllTickets()
      .pipe(
        takeUntil(this._unsubscribe$),
        finalize(() => this.loading = false)
      )
      .subscribe((data) => {
        const tickets = data.data;
        this.openedTickets = tickets.openTickets;
        this.closedTickets = tickets.closeTickets;
      })
  }

  public onClickAddQuestion(): void {
    const dialogRef = this._matDialog.open(AddQuestionComponent, {
      maxWidth: '80vw',
      width: "900px",
      maxHeight: '80vh'
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.isCreatedTicket) {
        this._getAllTickets();
      }
    })
  }

  public toggle(): void {
    this.open = !this.open;
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }



}
