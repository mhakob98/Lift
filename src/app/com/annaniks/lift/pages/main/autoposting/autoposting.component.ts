import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPostStoryComponent } from './add-post-story/add-post-story.component';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import {
  startOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
const colors: any = {
  pink: {
    primary: '#3399cc',
  },
  blue: {
    primary: '#a076b2',
  },

};
@Component({
  selector: 'app-autoposting',
  templateUrl: './autoposting.component.html',
  styleUrls: ['./autoposting.component.scss']
})
export class AutopostingComponent implements OnInit {
  public viewDate: Date = new Date();
  public storyActions: CalendarEventAction[] = [{
    label: '<i class="fa fa-fw fa-pencil"></i>',
    a11yLabel: 'Edit',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.addPostOrStory('story', 'Edited', event);
    }
  }]

  public events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'Some Story',
      color: colors.blue,
      actions: this.storyActions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: false
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'Some Post',
      color: colors.pink,
      allDay: true
    },

  ];

  constructor(public _dialog: MatDialog) { }

  ngOnInit() {
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(events);
    // if ( ){}
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date)) ||
        events.length === 0
      ) {

      }
      this.viewDate = date;
    }
  }



  public addPostOrStory(type: string, action: string, event): void {

    const dialogRef = this._dialog.open(AddPostStoryComponent, {
      width: '1200px',
      panelClass: 'add-ps-container',
      data: { type, action, event }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}

