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


@NgModule({
    declarations: [
        HeaderComponent,
        HeaderUserComponent,
        HeaderNotificationComponent,
        HeaderHelpComponent,
        HeaderSwitchAccountComponent
    ],
    exports: [
        HeaderNotificationComponent,
        HeaderHelpComponent,
        HeaderSwitchAccountComponent
    ],
    imports: [
    ]
})
export class LayoutModule { }
