import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionComponent } from './add-question/add-question.component';

@Component({
  selector: 'app-support-service',
  templateUrl: './support-service.component.html',
  styleUrls: ['./support-service.component.scss']
})
export class SupportServiceComponent implements OnInit {
  public open: boolean = false;


  constructor(private _matDialog: MatDialog) { }

  ngOnInit() {
  }

  public toggle(): void {
    this.open = !this.open;
  }

  public onClickAddQuestion(): void {
    const dialogRef = this._matDialog.open(AddQuestionComponent, {
      maxWidth: '80vw',
      width:"900px",
      maxHeight: '80vh'
    });
  }

}
