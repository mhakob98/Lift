import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from '../../../core/services/navbar.service';
import { MessagingService } from './messaging.service'
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.scss']
})
export class DirectComponent implements OnInit, OnDestroy {
  public allChats: any;
  public activeChatIndex: number = 0;
  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private _navbarService: NavbarService,
    private socket: Socket,
    private _messagingService: MessagingService,
    private _authService: AuthService
  ) {
    this._navbarService.setNavbarItems([]);
    this.socket.connect()

  }

  ngOnInit() {
    this._messagingService.listenNotify().pipe(takeUntil(this._unsubscribe$)).subscribe((data) => {
      console.log(data);

    })
    this._messagingService.getMessage()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        this.allChats = data
        console.log(this.allChats);
        setInterval(() => {
          this._messagingService.emitNotify();
        }, 5000)
        // this._unsubscribe$.next()
        // this._unsubscribe$.unsubscribe()
        // this._messagingService.sendMessage({ thread_id: data.messages[0].thread_id, message: "Taza namak" })
      })
  }

  public getPhotoByUserId(userId: number): { picture: string, isIncoming: boolean } {
    let profilePicture: string = this._authService.getAccount().avatar
    let isIncoming: boolean = false
    this.allChats[this.activeChatIndex].users.map(user => {
      if (user.pk == userId) {
        profilePicture = user.profile_pic_url
        isIncoming = true
      }
    })
    return { picture: profilePicture, isIncoming }
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete()
    this.socket.removeAllListeners()
    this.socket.disconnect()
  }

}
