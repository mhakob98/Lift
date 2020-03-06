import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPostStoryComponent } from './add-post-story/add-post-story.component';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {
  isSameMonth,
} from 'date-fns';
import { AutoPostingService } from './autoposting.service';
import { GetPostAndStoriesData, PostOrStory } from '../../../core/models/autoposting';
import { AuthService } from '../../../core/services/auth.service';
import { colors } from '../../../core/themes/calendar';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, map, switchMap, finalize } from 'rxjs/operators';
import { InstagramAccount } from '../../../core/models/user';

@Component({
  selector: 'app-autoposting',
  templateUrl: './autoposting.component.html',
  styleUrls: ['./autoposting.component.scss']
})
export class AutopostingComponent implements OnInit {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  private _activeAccount: InstagramAccount = {} as InstagramAccount;
  public events: CalendarEvent[] = [];
  public locale: string = 'ru';
  public view: CalendarView = CalendarView.Month;
  public postOrStroies: PostOrStory[] = [];
  public viewDate: Date = new Date();
  public loading: boolean = true;

  constructor(
    private _autoPostingService: AutoPostingService,
    private _dialog: MatDialog,
    private _authService: AuthService,
  ) { }

  ngOnInit() {
    this._getActiveAccount();
  }

  private _getActiveAccount(): void {
    this._authService.getActiveAccount()
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap((data) => {
          this._activeAccount = data;
          this.viewDate = new Date();
          return this._getStoriesAndPosts();
        })
      ).subscribe();
  }

  private _getStoriesAndPosts(): Observable<void> {
    const month = this.viewDate.getMonth();
    const year = this.viewDate.getFullYear();
    this.loading = true;
    const sendingData: GetPostAndStoriesData = {
      accountId: this._activeAccount.id,
      month: month + 1,
      year: year
    }
    return this._autoPostingService.getPostsAndStoriesByMonth(sendingData)
      .pipe(
        takeUntil(this._unsubscribe$),
        finalize(() => { this.loading = false }),
        map((data) => {
          this.postOrStroies = data.data;
          const events: CalendarEvent[] = [];
          this.postOrStroies.map((element, index) => {
            const event: CalendarEvent = {
              id: element.id,
              start: new Date(element.time),
              end: new Date(element.time),
              title: (element.type == 'post') ? element.date.caption : 'Story',
              color: (element.type == 'story') ? colors.pink : colors.blue,
            }
            events.push(event);
          })
          this.events = events;
        })
      )

  }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
    }
  }

  public changeMonth($event: Date): void {
    this._getStoriesAndPosts().subscribe();
  }

  public addPostOrStory(type: string, calendarEvent?: CalendarEvent): void {
    let event = null;
    if (calendarEvent) {
      event = this.postOrStroies.find((element) => element.id === calendarEvent.id) || null;
    }
    const dialogRef = this._dialog.open(AddPostStoryComponent, {
      maxWidth: '1200px',
      panelClass: 'add-ps-container',
      data: {
        type: (event) ? event.type : type,
        editable: (event) ? true : false,
        event: event
      }
    });
    dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (result && result.changed) {
          return this._getStoriesAndPosts();
        }
        return of();
      })
    ).subscribe();
  }

}

