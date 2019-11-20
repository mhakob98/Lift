
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { AutoSubscribeRoutingModule } from './auto-subscribe.routing.module';
import { AutoSubscribeService } from './auto-subscribe.service';
import { SubscriptionSuitableComponent } from './subscription-suitable/subscription-suitable.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AudienceFilterComponent } from './audience-filter/audience-filter.component';
import { AfterSubscriptionComponent } from './after-subscription/after-subscription.component';

@NgModule({
    declarations: [
        AutoSubscribeRoutingModule.components,
        SubscriptionSuitableComponent,
        AudienceFilterComponent,
        AfterSubscriptionComponent,
    ],
    imports: [
        AutoSubscribeRoutingModule,
        CommonModule,
        ReactiveFormsModule
    ],

    providers: [AutoSubscribeService]
})
export class AutoSubscribeModule {
}
