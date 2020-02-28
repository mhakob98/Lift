import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../../core/services/auth.service';
import * as io from 'socket.io-client';

@Injectable()
export class MessagingService {
    public socket;

    constructor(
        private _authService: AuthService,
        private _cookieService: CookieService
    ) {
        this.socket = io(environment.socketUrl, {
            query: `accessToken=${this._cookieService.get('accessToken')}&loginId=${this._authService.getAccount().id}`
        });
    }

    public sendMessage(chat: { thread_id: string, message: string }): void {
        this.socket.emit("message", { thread_id: chat.thread_id, message: chat.message });
    }

    public getMessage = () => {
        return Observable.create((observer) => {
            this.socket.on('inbox', (data) => {
                observer.next(data.messages);
            });
        });
    }

    public setActiveChat(activeThread: any): void {
        this.socket.emit('select-threed', activeThread)
    }

    public subscribeToActiveThread = () => {
        return Observable.create((observer) => {
            this.socket.on('select-threed', (data) => {
                console.log(data);

                observer.next(data);
            });
        });
    }

    public emitMoreMessages(): void {
        this.socket.emit('more-message')
    }

    public getMoreMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('more-message', (data) => {
                observer.next(data.message);
            });
        });
    }

    public immediatlyFetchMessages(): void {
        this.socket.emit('immediatly-fetch-messages')
    }

    public uploadBase64(base64: string): void {
        this.socket.emit('message-image', base64)
    }

    public createChat(memebers: number[]): void {
        this.socket.emit('new-message', memebers)
    }

    public subscribeToChat = () => {
        return Observable.create((observer) => {
            this.socket.on('new-message', (data) => {
                observer.next(data);
            });
        });
    }

    public emitMoreInbox(): void {
        this.socket.emit('more-inbox');
    }

    public getMoreInbox = () => {
        return Observable.create((observer) => {
            this.socket.on('more-inbox', (data) => {
                observer.next(data);
            });
        });
    }

    public getUnreads = () => {
        return Observable.create((observer) => {
            this.socket.on('unreads', (data) => {
                observer.next(data);
            });
        });
    }

    public messageSuccessfullySent = () => {
        return Observable.create((observer) => {
            this.socket.on('message', (data) => {
                observer.next(data);
            });
        });
    }




}