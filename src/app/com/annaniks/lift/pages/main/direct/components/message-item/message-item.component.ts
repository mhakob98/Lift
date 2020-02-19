import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { DirectMessage } from 'src/app/com/annaniks/lift/core/models/direct.message';
import { MessagingService } from '../../messaging.service';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageItemComponent implements OnInit {

  @Input('message') public directMessage: DirectMessage = {} as DirectMessage;

  @Input('previousMessage') public previousMessage: DirectMessage = {} as DirectMessage

  @Input('senderPhoto') public userPhoto: string = ''

  @Input('isIncoming') public isIncoming: boolean = false;


  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private _messagingService: MessagingService
  ) { }

  ngOnInit() {
    this.getImageSource()
  }


  public getImageSource(): { imageSource: string, isImage: boolean } {
    let response: { imageSource: string, isImage: boolean } = { imageSource: '', isImage: true }
    switch (this.directMessage.item_type) {
      case 'media':
        response.imageSource = this.getCompressedImage[this.getCompressedImage.length - 1].url
        break;
      case 'animated_media':
        response.imageSource = this.directMessage.animated_media.images.fixed_height.url
        break;
      default:
        response.isImage = false
    }
    return response
  }

  // public readThenSendFile(data) {

  //   var reader = new FileReader();
  //   reader.onload = function (evt) {
  //     var msg: any;
  //     msg.file = evt.target.result;
  //     msg.fileName = data.name;
  //     this.socket.emit('base64 file', msg);
  //   };
  //   reader.readAsDataURL(data);
  // }

  private get getCompressedImage() {
    return this.directMessage.media.image_versions2.candidates
  }
}
