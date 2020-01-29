
// Angular Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Our Components
import { PromotionComponent } from './promotion.component'

const promotionRoutes: Routes = [
    {
        path: '', component: PromotionComponent, children: [
            { path: '', redirectTo: '/promotion/autosubscribe', pathMatch: 'full' },
            {
                path: 'autosubscribe',
                data: { type: 'subscribe' },
                loadChildren: () => import('./auto-subscribe-or-watch-story/auto-subscribe-watch-story.module')
                    .then(m => m.AutoSubscribeOrWatchStoryModule)
            },
            {
                path: 'auto-watch-story',
                data: { type: 'story' },
                loadChildren: () => import('./auto-subscribe-or-watch-story/auto-subscribe-watch-story.module')
                    .then(m => m.AutoSubscribeOrWatchStoryModule)
            },
            {
                path: 'bonuses',
                loadChildren: () => import('./bonuses/bonuses.module')
                    .then(m => m.BonusesModule)
            },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(promotionRoutes)],
    exports: [RouterModule]
})
export class PromotionRoutingModule {
    static components = [PromotionComponent]
}
