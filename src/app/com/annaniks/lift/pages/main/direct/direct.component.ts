import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NavbarService } from '../../../core/services/navbar.service';
import { MessagingService } from './messaging.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WriteDirectMessageData } from '../../../core/models/direct.message';
import { CookieService } from 'ngx-cookie';


@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DirectComponent implements OnInit, OnDestroy {
  public allChats: any;
  public activeChatIndex: number = 0;
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public messageForm: FormGroup;
  public createChatOpened: boolean = false;
  private _messagingService: MessagingService;

  constructor(
    private _navbarService: NavbarService,
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _cookiesService: CookieService,
  ) {
    this._navbarService.setNavbarItems([]);
    this._messagingService = new MessagingService(_authService, _cookiesService)
  }

  ngOnInit() {
    this._initForm();
    this._fetchMessages();
    this.subscribeToActiveChatEvent();
    this.getMoreMessages()
    this._immediatlyFetchMessages()
  }

  private _initForm(): void {
    this.messageForm = this._fb.group({
      message: [null, Validators.required]
    })
  }

  private _immediatlyFetchMessages(): void {
    MessagingService.immediatlyFetchMessages();
  }

  private _fetchMessages(): void {
    MessagingService.getMessage()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        this.allChats = data
        this.setActiveChat(0)
      })
  }

  public sendMessage(): void {
    const writeMessageData: WriteDirectMessageData = {
      thread_id: this.allChats[this.activeChatIndex].thread_id,
      message: this.messageForm.get('message').value,
    }
    MessagingService.sendMessage(writeMessageData)
    this.messageForm.get('message').reset();
  }

  public getPhotoByUserIdAndCheckIfIncoming(userId: number): { picture: string, isIncoming: boolean } {
    let profilePicture: string = this._authService.getAccount().avatar || 'assets/icons/avatar.png'
    let isIncoming: boolean = false;
    this.allChats[this.activeChatIndex].users.map(user => {
      if (user.pk == userId) {
        profilePicture = user.profile_pic_url
      }
    })
    if (userId.toString() == this._authService.getAccount().instagramId) {
      isIncoming = true
    }
    return { picture: profilePicture, isIncoming }
  }

  public setActiveChat(ind: number) {
    this.activeChatIndex = ind
    MessagingService.setActiveChat(this.allChats[ind])
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
    MessagingService.uploadBase64(e.target.result)
  }

  public subscribeToActiveChatEvent(): void {
    MessagingService.subscribeToActiveThread()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(data => {
      })
  }

  public onScrolledUp(): void {
    MessagingService.emitMoreMessages();
  }

  public getMoreMessages(): void {
    MessagingService.getMoreMessages()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(moreMessages => {
        this.allChats[this.activeChatIndex].items.push(...moreMessages.items)
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
    MessagingService.removeAllListeners();
    MessagingService.disconnect();
  }

}
