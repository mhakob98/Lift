import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DirectMessage } from '../../../core/models/direct.message';
@Injectable()
export class MessagingService {

    constructor(private socket: Socket) { }

    public sendMessage(chat: { thread_id: string, message: string }): void {
        this.socket.emit("message", { thread_id: chat.thread_id, message: chat.message });
    }

    public getMessage(): Observable<[]> {
        return this.socket.fromEvent("inbox").pipe(map((data: { messages: [] }) => data.messages))
    }

    public emitNotify(): void {
        this.socket.emit("notify");
    }

    public listenNotify(): Observable<any> {
        return this.socket.fromEvent("notify")
    }

    public uploadImage(): void {
        this.socket.emit('')
    }

    public setActiveChat(activeThread: any): void {
        this.socket.emit('select-threed', activeThread)
    }

    public subscribeToActiveThread(): Observable<any> {
        return this.socket.fromEvent('select-threed')
    }

    public emitMoreMessages(): void {
        this.socket.emit('more-message')
    }

    public getMoreMessages(): Observable<{ items: DirectMessage[] }> {
        return this.socket.fromEvent('more-message');
    }
}