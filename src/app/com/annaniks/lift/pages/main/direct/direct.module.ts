// Angular Core Modules
import { NgModule } from '@angular/core';
import { DirectRoutingModule } from './direct.routing.module';
import { CommonModule } from '@angular/common';
// 3rd part libraries
import { SharedModule } from '../../../shared/shared.module';
import { MessagingService } from './messaging.service';
//DirectScheduleComponent
import { DirectScheduleComponent } from './components';
///CheckboxModule
import {CheckboxModule} from 'primeng/checkbox';
@NgModule({
    declarations: [
        DirectRoutingModule.components,
        DirectScheduleComponent
    ],
    imports: [
        DirectRoutingModule,
        CommonModule,
        SharedModule,
        CheckboxModule
    ],
    providers: [
        MessagingService
    ]
})
export class DirectModule { }