
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { SubscribersRoutingModule } from './subscribes-posts.routing.module';
import { SubscribesPostsService } from './subscribes-posts.service';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
    declarations: [
        SubscribersRoutingModule.components,
    ],
    imports: [
        SubscribersRoutingModule,
        CommonModule,
        SharedModule
    ],

    providers: [SubscribesPostsService]
})
export class SubscribesPostsModule { }
