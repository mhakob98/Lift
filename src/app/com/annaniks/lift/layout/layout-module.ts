// Angular Core Modules
import { NgModule } from '@angular/core';

// Components
import {
    HeaderComponent,
    HeaderUserComponent,
    HeaderNotificationComponent,
    HeaderHelpComponent,
    HeaderSwitchAccountComponent,
    SubmenuComponent
} from './';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
        HeaderComponent,
        HeaderUserComponent,
        HeaderNotificationComponent,
        HeaderHelpComponent,
        HeaderSwitchAccountComponent,
        SubmenuComponent
    ],
    exports: [
        HeaderComponent,
        SubmenuComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
    ]
})
export class LayoutModule { }
