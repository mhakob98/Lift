
// Angular Core Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Our Components
import { PromotionComponent } from './promotion.component'

let promotionRoutes: Routes = [
    {
        path: '', component: PromotionComponent, children: [
            { path: '', redirectTo: '/promotion/autosubscribe', pathMatch: 'full' },
            {
                path: 'autosubscribe',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/main/promotion/auto-subscribe/auto-subscribe.module')
                    .then(m => m.AutoSubscribeModule)
            },
            {
                path: 'bonuses',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/main/promotion/bonuses/bonuses.module')
                    .then(m => m.BonusesModule)
            },
            {
                path: 'stories-autosubscribe',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/main/promotion/stories-auto-subscribe/stories-auto-subscribe.module')
                    .then(m => m.StoriesAutoSubscribeModule)
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
