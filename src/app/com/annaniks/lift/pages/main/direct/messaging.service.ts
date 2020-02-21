import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DirectMessage } from '../../../core/models/direct.message';
import { environment } from 'src/environments/environment';
import { AppModule } from 'src/app/app.module';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../../core/services/auth.service';
@Injectable()
export class MessagingService extends Socket {

    constructor(
        private _authService: AuthService,
        private _cookieService: CookieService
    ) {
        super({
            url: environment.socketUrl, options: {
                query: `accessToken=${_cookieService.get('accessToken')}&loginId=${_authService.getAccount().id}`
            }
        });
        console.log("CONNECTING");
    }

    public sendMessage(chat: { thread_id: string, message: string }): void {
        this.emit("message", { thread_id: chat.thread_id, message: chat.message });
    }

    public getMessage(): Observable<[]> {
        return this.fromEvent("inbox").pipe(map((data: { messages: [] }) => data.messages))
    }

    public setActiveChat(activeThread: any): void {
        this.emit('select-threed', activeThread)
    }

    public subscribeToActiveThread(): Observable<any> {
        return this.fromEvent('select-threed')
    }

    public emitMoreMessages(): void {
        this.emit('more-message')
    }

    public getMoreMessages(): Observable<{ items: DirectMessage[] }> {
        return this.fromEvent('more-message');
    }

    public immediatlyFetchMessages(): void {
        this.emit('immediatly-fetch-messages')
    }

    public uploadBase64(base64: string): void {
        this.emit('message-image', base64)
    }

}