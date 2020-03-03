import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { NavbarService } from '../../../core/services/navbar.service';
import { MessagingService } from './messaging.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WriteDirectMessageData, DirectMessage } from '../../../core/models/direct.message';


@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DirectComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public allChats: any[] = [];
  public activeChatMessages: DirectMessage[] = []
  public activeChat: any;
  public messageForm: FormGroup;
  public createChatOpened: boolean = false;
  public loading: boolean = false;

  constructor(
    private _navbarService: NavbarService,
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _messagingService: MessagingService
  ) {
    this.loading = true
    this._navbarService.setNavbarItems([]);
  }

  ngOnInit() {
    this._initForm();
    this._fetchMessages();
    this.subscribeToActiveChatEvent();
    this.getMoreMessages()
    this._immediatlyFetchMessages()
    this.getMoreInbox();
    this._getUnreadChats();
    this._subscribeToMessageStatus();
  }

  private _initForm(): void {
    this.messageForm = this._fb.group({
      message: [null, Validators.required]
    })
  }

  private _immediatlyFetchMessages(): void {
    this._messagingService.immediatlyFetchMessages();
  }

  private _fetchMessages(): void {
    this._messagingService.getMessage()
      .pipe(
        takeUntil(this._unsubscribe$),
      )
      .subscribe((data) => {
        this.allChats = data;
        this.setActiveChat(this.allChats[0])
      })
  }

  private _getUnreadChats(): void {
    this._messagingService.getUnreads()
      .pipe(
        takeUntil(this._unsubscribe$)
      )
      .subscribe(chats => {
        const chatsArray = [];
        chatsArray.push(...chats.items);
        this.allChats.map((data) => {
          const chatIndex = chatsArray.findIndex((element) => element.thread_id === data.thread_id);
          if (chatIndex == -1) {
            chatsArray.push(data);
          }
        })
        this.allChats = chatsArray;
        // this.setActiveChat(this.allChats[0]);
      })
  }

  public sendMessage(): void {
    const writeMessageData: WriteDirectMessageData = {
      thread_id: this.activeChat.thread_id,
      message: this.messageForm.get('message').value,
    }
    this._messagingService.sendMessage(writeMessageData)
    this.messageForm.get('message').reset();
  }

  public getPhotoByUserIdAndCheckIfIncoming(userId: number): { picture: string, isIncoming: boolean } {
    let profilePicture: string = this._authService.getAccount().avatar || 'assets/icons/avatar.png'
    let isIncoming: boolean = false;
    this.activeChat.users.map(user => {
      if (user.pk == userId) {
        profilePicture = user.profile_pic_url
      }
    })
    if (userId.toString() == this._authService.getAccount().instagramId) {
      isIncoming = true
    }
    return { picture: profilePicture, isIncoming }
  }

  public setActiveChat(thread) {
    this.loading = true
    this.activeChat = thread
    this.activeChatMessages = [];
    if (thread) {
      this._messagingService.setActiveChat(thread)
    }
  }

  private _subscribeToMessageStatus(): void {
    this._messagingService.messageSuccessfullySent()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        this.activeChatMessages.unshift(data.item)
      })
  }

  public handleInputChange(e): void {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  private _handleReaderLoaded(e): void {
    this._messagingService.uploadBase64(e.target.result)
  }

  public subscribeToActiveChatEvent(): void {
    this._messagingService.subscribeToActiveThread()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        let index: number;
        this.allChats.map((chat, ind: number) => {
          if (chat.thread_id == data.threed.thread_id) {
            index = ind
          }
        })
        this.allChats[index] = data.threed
        this.activeChatMessages = data.items;
        this.loading = false
      })
  }

  public onScrolledUp(): void {
    this._messagingService.emitMoreMessages();
  }

  public moreInbox(): void {
    this._messagingService.emitMoreInbox()
  }



  public getMoreInbox(): void {
    this._messagingService.getMoreInbox()
      .pipe(
        takeUntil(this._unsubscribe$)
      )
      .subscribe((moreInbox) => {
        if (moreInbox.messages.length > 0) {
          this.allChats.push(...moreInbox.messages)
        }
      })
  }

  public getMoreMessages(): void {
    this._messagingService.getMoreMessages()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(moreMessages => {
        this.activeChatMessages.push(...moreMessages.items)

        // this.allChats[this.activeChatIndex].items.push(...moreMessages.items)
      })
  }

  public onClickedOutside(): void {
    if (this.createChatOpened) {
      this.createChatOpened = false;
    }
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._messagingService.socket.removeAllListeners();
    this._messagingService.socket.disconnect();
  }

}
