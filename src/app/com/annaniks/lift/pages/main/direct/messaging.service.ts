import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DirectMessage } from '../../../core/models/direct.message';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../../core/services/auth.service';

declare let self;
export class MessagingService extends Socket {
    constructor(
        _authService: AuthService,
        _cookieService: CookieService
    ) {
        super({
            url: environment.socketUrl, options: {
                query: `accessToken=${_cookieService.get('accessToken')}&loginId=${_authService.getAccount().id}`
            }
        });
        self = this;
    }

    public static sendMessage(chat: { thread_id: string, message: string }): void {
        self.emit("message", { thread_id: chat.thread_id, message: chat.message });
    }

    public static getMessage(): Observable<[]> {
        return self.fromEvent("inbox").pipe(map((data: { messages: [] }) => data.messages))
    }

    public static setActiveChat(activeThread: any): void {
        self.emit('select-threed', activeThread)
    }

    public static subscribeToActiveThread(): Observable<any> {
        return self.fromEvent('select-threed')
    }

    public static emitMoreMessages(): void {
        self.emit('more-message')
    }

    public static getMoreMessages(): Observable<{ items: DirectMessage[] }> {
        return self.fromEvent('more-message');
    }

    public static immediatlyFetchMessages(): void {
        self.emit('immediatly-fetch-messages')
    }

    public static uploadBase64(base64: string): void {
        self.emit('message-image', base64)
    }

    public static createChat(memebers: number[]): void {
        self.emit('new-message', memebers)
    }

    public static subscribeToChat(): Observable<any> {
        return self.fromEvent('new-message');
    }

    public static emitMoreInbox(): void {
        self.emit('more-inbox');
    }

    public static getMoreInbox(): Observable<any> {
        return self.fromEvent('more-inbox');
    }

    public static getUnreads(): Observable<{ items: any, messages: DirectMessage[] }> {
        return self.fromEvent('unreads')
    }

    public static messageSuccessfullySent(): Observable<any> {
        return self.fromEvent('message')
    }

    public static removeAllListeners(): void {
        self.removeAllListeners();
    }

    public static disconnect(): void {
        self.disconnect();
    }


}