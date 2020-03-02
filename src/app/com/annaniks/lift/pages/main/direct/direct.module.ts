// Angular Core Modules
import { NgModule } from '@angular/core';
import { DirectRoutingModule } from './direct.routing.module';
import { CommonModule } from '@angular/common';
// 3rd part libraries
import { SharedModule } from '../../../shared/shared.module';
import { MessagingService } from './messaging.service';

@NgModule({
    declarations: [
        DirectRoutingModule.components,
    ],
    imports: [
        DirectRoutingModule,
        CommonModule,
        SharedModule
    ],
    providers: [
        MessagingService
    ]
})
export class DirectModule { }