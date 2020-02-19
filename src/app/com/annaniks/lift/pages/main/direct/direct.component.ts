import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { NavbarService } from '../../../core/services/navbar.service';
import { MessagingService } from './messaging.service'
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WriteDirectMessageData } from '../../../core/models/direct.message';

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

  constructor(
    private _navbarService: NavbarService,
    private socket: Socket,
    private _messagingService: MessagingService,
    private _authService: AuthService,
    private _fb: FormBuilder,

  ) {
    this._navbarService.setNavbarItems([]);
    this.socket.connect()
    // this.viewport.scrollToIndex(2)
  }

  ngOnInit() {
    this._initForm();
    this._fetchMessages();
    this.subscribeToActiveChatEvent();
    this.getMoreMessages()
  }

  private _initForm(): void {
    this.messageForm = this._fb.group({
      message: [null, Validators.required]
    })
  }

  private _fetchMessages(): void {
    this._messagingService.getMessage()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        this.allChats = data
        console.log(this.allChats);
        // this._messagingService.listenNotify().pipe(takeUntil(this._unsubscribe$)).subscribe((data) => {
        //   console.log(data);

        // })
        // setInterval(() => {
        //   this._messagingService.emitNotify();
        // }, 5000)
        // this._unsubscribe$.next()
        // this._unsubscribe$.unsubscribe()
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

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete()
    this.socket.removeAllListeners()
    this.socket.disconnect()
  }

}
