// Angular Core Modules
import { NgModule } from '@angular/core';
import { DirectRoutingModule } from './direct.routing.module';
import { CommonModule } from '@angular/common';
// 3rd part libraries
import { SharedModule } from '../../../shared/shared.module';
import { MessagingService } from './messaging.service';
//DirectScheduleComponent DirectSentComponent
import { DirectScheduleComponent, DirectSentComponent } from './components';
///CheckboxModule
import {CheckboxModule} from 'primeng/checkbox';


@NgModule({
    declarations: [
        DirectRoutingModule.components,
        DirectScheduleComponent,
        DirectSentComponent
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