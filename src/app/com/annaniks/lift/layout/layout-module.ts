// Angular Core Modules
import { NgModule } from '@angular/core';

// Components
import {
    HeaderComponent,
    HeaderUserComponent,
    HeaderNotificationComponent,
    HeaderHelpComponent,
    HeaderSwitchAccountComponent,
} from './index';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    declarations: [
        HeaderComponent,
        HeaderUserComponent,
        HeaderNotificationComponent,
        HeaderHelpComponent,
        HeaderSwitchAccountComponent
    ],
    exports: [
        HeaderComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class LayoutModule { }
