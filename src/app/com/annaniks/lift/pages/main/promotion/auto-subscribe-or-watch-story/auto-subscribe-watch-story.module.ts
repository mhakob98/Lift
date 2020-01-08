
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { AutoSubscribeOrWatchStoryRoutingModule } from './auto-subscribe-watch-story.routing.module';
import { AutoSubscribeOrWatchStoryService } from './auto-subscribe-watch-story.service';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        AutoSubscribeOrWatchStoryRoutingModule.components,
    ],
    imports: [
        AutoSubscribeOrWatchStoryRoutingModule,
        CommonModule,
        ReactiveFormsModule
    ],

    providers: [AutoSubscribeOrWatchStoryService]
})
export class AutoSubscribeOrWatchStoryModule {
}
