import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPostStoryComponent } from './add-post-story/add-post-story.component';

@Component({
  selector: 'app-autoposting',
  templateUrl: './autoposting.component.html',
  styleUrls: ['./autoposting.component.scss']
})
export class AutopostingComponent implements OnInit {

  constructor(public _dialog: MatDialog) { }

  ngOnInit() {
  }

  public addPostOrStory(type: string): void {
    const dialogRef = this._dialog.open(AddPostStoryComponent, {
      width: '1200px',
      panelClass: 'add-ps-container',
      data: { type }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}

