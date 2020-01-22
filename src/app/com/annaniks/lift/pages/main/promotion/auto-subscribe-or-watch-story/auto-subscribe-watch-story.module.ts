
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { AutoSubscribeOrWatchStoryRoutingModule } from './auto-subscribe-watch-story.routing.module';
import { AutoSubscribeOrWatchStoryService } from './auto-subscribe-watch-story.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SubscribeWatchConditionComponent } from './subscribe-watch-condition/subscribe-watch-condition.component';
import { AddHashtagComponent } from './add-hashtag/add-hashtag.component';
import { AccountSearchComponent } from './account-search/account-search.component';
import { SharedModule } from '../../../../shared/shared.module';
import { AccountByLocationComponent } from './account-by-location/account-by-location.component';

@NgModule({
    declarations: [
        AutoSubscribeOrWatchStoryRoutingModule.components,
        SubscribeWatchConditionComponent,
        AddHashtagComponent,
        AccountSearchComponent,
        AccountByLocationComponent,
    ],
    imports: [
        AutoSubscribeOrWatchStoryRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
    ],

    providers: [AutoSubscribeOrWatchStoryService]
})
export class AutoSubscribeOrWatchStoryModule {
}
