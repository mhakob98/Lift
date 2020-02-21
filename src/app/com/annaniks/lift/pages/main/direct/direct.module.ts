// Angular Core Modules
import { NgModule } from '@angular/core';
import { DirectRoutingModule } from './direct.routing.module';
import { CommonModule } from '@angular/common';
import { MessageItemComponent } from './components';
// 3rd part libraries
import { SocketIoModule } from 'ngx-socket-io';
import { MessagingService } from './messaging.service';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [
        DirectRoutingModule.components,
        MessageItemComponent,
    ],
    imports: [
        DirectRoutingModule,
        CommonModule,
        SocketIoModule,
        SharedModule
    ],
    providers: [
        MessagingService
    ]
})
export class DirectModule { }