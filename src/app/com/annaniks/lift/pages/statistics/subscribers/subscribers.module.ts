
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { SubscribersRoutingModule } from './subscribers.routing.module';

@NgModule({
    declarations: [
        SubscribersRoutingModule.components
    ],
    imports: [
        SubscribersRoutingModule,
        CommonModule,
    ],

    providers: []
})
export class SubscribersModule { }
