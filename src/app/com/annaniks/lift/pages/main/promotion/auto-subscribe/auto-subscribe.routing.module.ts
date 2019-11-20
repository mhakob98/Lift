// Angular Core Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Our Components
import { AutoSubscribeComponent } from './auto-subscribe.component';
import { SubscriptionSuitableComponent } from './index';

const autoSubscribeRoutes: Routes = [
    { path: '', component: AutoSubscribeComponent }
]

@NgModule({
    imports: [RouterModule.forChild(autoSubscribeRoutes)],
    exports: [RouterModule]
})
export class AutoSubscribeRoutingModule {
    static components = [AutoSubscribeComponent, SubscriptionSuitableComponent]
}