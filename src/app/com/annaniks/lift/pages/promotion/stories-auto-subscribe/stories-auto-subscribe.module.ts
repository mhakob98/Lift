
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { StoriesAutoSubscribeRoutingModule } from './stories-auto-subscribe.routing.module';

@NgModule({
    declarations: [
        StoriesAutoSubscribeRoutingModule.components
    ],
    imports: [
        StoriesAutoSubscribeRoutingModule,
        CommonModule,
    ],

    providers: []
})
export class StoriesAutoSubscribeModule { }
