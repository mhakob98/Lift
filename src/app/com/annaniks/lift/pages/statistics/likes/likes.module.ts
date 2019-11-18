
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { LikesRoutingModule } from './likes.routing.module';

@NgModule({
    declarations: [
        LikesRoutingModule.components
    ],
    imports: [
        LikesRoutingModule,
        CommonModule,
    ],

    providers: []
})
export class LikesModule { }
