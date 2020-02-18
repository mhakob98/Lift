import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
}