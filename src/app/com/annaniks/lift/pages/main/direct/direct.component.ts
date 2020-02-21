import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { NavbarService } from '../../../core/services/navbar.service';
import { MessagingService } from './messaging.service'
import { Subject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WriteDirectMessageData } from '../../../core/models/direct.message';
import { SearchTerm, Search } from '../../../core/models/search';
import { AutoSubscribeOrWatchStoryService } from '../promotion/auto-subscribe-or-watch-story/auto-subscribe-watch-story.service';


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
  public searchStream$: Observable<Search>;
  public createChatOpened: boolean = false;
  constructor(
    private _navbarService: NavbarService,
    private _messagingService: MessagingService,
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService,


  ) {
    this._navbarService.setNavbarItems([]);
  }

  ngOnInit() {
    this._initForm();
    this._immediatlyFetchMessages()
    this._fetchMessages();
    this.subscribeToActiveChatEvent();
    this.getMoreMessages()
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
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        this.allChats = data
        console.log(data);

      })
  }

  public sendMessage(): void {
    const writeMessageData: WriteDirectMessageData = {
      thread_id: this.allChats[this.activeChatIndex].thread_id,
      message: this.messageForm.get('message').value,
    }
    this._messagingService.sendMessage(writeMessageData)
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
    this._messagingService.setActiveChat(this.allChats[ind])
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
    console.log(e);

    this._messagingService.uploadBase64(e.target.result)
  }

  public subscribeToActiveChatEvent(): void {
    this._messagingService.subscribeToActiveThread()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(data => {
        console.log(data);

      })
  }

  public onScrolledUp(): void {
    this._messagingService.emitMoreMessages();
  }

  public getMoreMessages(): void {
    this._messagingService.getMoreMessages()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(moreMessages => {
        this.allChats[this.activeChatIndex].items.push(...moreMessages.items)
      })
  }

  public searchFor(searchEvent): void {
    let searchTerm: SearchTerm = {
      query: searchEvent.query,
      type: 'user'
    }
    searchTerm.type = 'user'
    this.searchStream$ = this._autoSubscribeOrWatchStoryService.searchFor(searchTerm).pipe(map(search => search.data))
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete()
    this._messagingService.removeAllListeners()
    this._messagingService.disconnect()
  }

}
