import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SendMessageTypes } from '../../../../../core/models/direct';
import { UtilsService } from 'src/app/com/annaniks/lift/core/services/utils.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {
  @Output() onTextSend: EventEmitter<string> = new EventEmitter();
  @Output() onFileSend: EventEmitter<any> = new EventEmitter();
  @Input() type: SendMessageTypes;
  @Input('foreignText')
  set setText(texts: string[]) {
    if (texts && this.messageForm) {
      this.messageForm.get('message').setValue([...texts])
    }
  }
  @ViewChild('fileInput', { static: false }) fileInput;

  public messageForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
  ) { }

  ngOnInit() {
    this._initForm();
  }

  private _initForm(): void {
    this.messageForm = this._fb.group({
      message: [null, Validators.required]
    })
  }

  public handleInputChange(e): void {
    console.log("ERa");

    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = this.type == SendMessageTypes.Direct ? /image.*/ : /text.*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert(`Можно загружать только файлы в формате ${this.type == SendMessageTypes.Direct ? 'jpeg' : 'txt'} `);
      return;
    }
    if (this.type == SendMessageTypes.Schedule) {
      const formData: FormData = new FormData();
      formData.append('txt', file, file.name);
      this.onFileSend.emit(formData)
    } else if (SendMessageTypes.Direct) {
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
    this.fileInput.nativeElement.value = '';
  }



  private _handleReaderLoaded(e): void {
    this.onFileSend.emit(e.target.result)
  }

  sendMessage(): void {
    this.onTextSend.emit(this.messageForm.get('message').value);
    this.messageForm.get('message').reset();
    console.log(this.messageForm);

  }
} 
