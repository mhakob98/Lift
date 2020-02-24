import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessagingService } from '../../messaging.service';
import { SearchTerm, Search } from 'src/app/com/annaniks/lift/core/models/search';
import { Observable, Subject } from 'rxjs';
import { AutoSubscribeOrWatchStoryService } from '../../../promotion/auto-subscribe-or-watch-story/auto-subscribe-watch-story.service';
import { map, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss'],
})
export class CreateChatComponent implements OnInit {

  @Input() allChats: any;
  @Input() activeChatIndex: number;
  @Input() createChatOpened: boolean;

  @Output() allChatsChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() activeChatIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() createChatOpenedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public chatMembers: FormControl = new FormControl('');
  public searchStream$: Observable<Search>;
  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private _autoSubscribeOrWatchStoryService: AutoSubscribeOrWatchStoryService,
  ) {
  }

  ngOnInit() {
    this.subscribeToChatCreating();
  }

  public createChat(): void {
    let memebers: number[] = []
    this.chatMembers.value.filter(element => {
      memebers.push(Number(element.pk));
    });
    MessagingService.createChat(memebers);
  }

  public searchFor(searchEvent): void {
    let searchTerm: SearchTerm = {
      query: searchEvent.query,
      type: 'user'
    }
    searchTerm.type = 'user';
    this.searchStream$ = this._autoSubscribeOrWatchStoryService.searchFor(searchTerm).pipe(map(search => search.data))
  }

  public subscribeToChatCreating(): void {
    MessagingService.subscribeToChat()
      .pipe(
        takeUntil(this._unsubscribe$)
      )
      .subscribe(data => {
        let isChatExists: boolean = false
        let chatIndex: number = 0;
        this.allChats.map((chat, index: number) => {
          if (chat.thread_id == data.newThreed.thread_id) {
            isChatExists = true;
            chatIndex = index
          }
        })
        if (!isChatExists) {
          this.allChats.unshift(data.newThreed)
          this._actionsAfterChatCreating(chatIndex)
          this.allChatsChange.emit(this.allChats)
        } else {
          this._actionsAfterChatCreating(chatIndex)
        }
      })
  }

  private _actionsAfterChatCreating(chatIndex): void {
    MessagingService.setActiveChat(this.allChats[chatIndex])
    this.activeChatIndex = chatIndex;
    this.createChatOpened = false;
    this.activeChatIndexChange.emit(this.activeChatIndex);
    this.createChatOpenedChange.emit(this.createChatOpened)
  }
}
