import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

  public questionForm:FormGroup;
  constructor(private _dialogRef: MatDialogRef<AddQuestionComponent>,private _fb:FormBuilder) { }

  ngOnInit() {
    this._formBuilder();
  }

  public closeModal(): void {
    this._dialogRef.close();
  }

  private _formBuilder():void{
    this.questionForm=this._fb.group({
      subject:["",Validators.required],
      question:[""],
      messeges:["",Validators.required]
    })
  }

  public checkIsValid(controlName): boolean {
    return this.questionForm.get(controlName).hasError('required') && this.questionForm.get(controlName).touched;
}

}
