
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { SubscribersRoutingModule } from './subscribes-posts.routing.module';
import { SubscribesPostsService } from './subscribes-posts.service';

@NgModule({
    declarations: [
        SubscribersRoutingModule.components,
    ],
    imports: [
        SubscribersRoutingModule,
        CommonModule,
    ],

    providers: [SubscribesPostsService]
})
export class SubscribesPostsModule { }
