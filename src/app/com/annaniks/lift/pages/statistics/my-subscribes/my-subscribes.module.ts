
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { MySubscribersRoutingModule } from './my-subscribes.routing.module';

@NgModule({
    declarations: [
        MySubscribersRoutingModule.components
    ],
    imports: [
        MySubscribersRoutingModule,
        CommonModule,
    ],

    providers: []
})
export class MySubscribersModule { }
