
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { AutoSubscribeRoutingModule } from './auto-subscribe.routing.module';

@NgModule({
    declarations: [
        AutoSubscribeRoutingModule.components
    ],
    imports: [
        AutoSubscribeRoutingModule,
        CommonModule,
    ],

    providers: []
})
export class AutoSubscribeModule {
}
