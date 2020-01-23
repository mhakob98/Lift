import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const mainRoutes: Routes = [
    {
        path: '', component: MainComponent, children: [
            { path: '', redirectTo: '/statistics/preview', pathMatch: 'full' },
            {
                path: 'statistics',
                loadChildren: () => import('../../../../../com/annaniks/lift/pages/main/statistics/statistics.module')
                    .then(m => m.StatisticsModule)
            },
            {
                path: 'promotion',
                loadChildren: () => import('../../../../../com/annaniks/lift/pages/main/promotion/promotion.module')
                    .then(m => m.PromotionModule)
            },
            {
                path: 'autoposting',
                loadChildren: () => import('../../../../../com/annaniks/lift/pages/main/autoposting/autoposting.module')
                    .then(m => m.AutopostingModule)
            },
            {
                path: 'direct',
                loadChildren: () => import('../../../../../com/annaniks/lift/pages/main/direct/direct.module')
                    .then(m => m.DirectModule)
            },
            {
                path: 'account-settings',
                loadChildren: () => import('../../../../../com/annaniks/lift/pages/main/account-settings/account-settings.module')
                    .then(m => m.AccountSettingsModule)
            },
            {
                path: 'support-service',
                loadChildren: () => import('../../../../../com/annaniks/lift/pages/main/support-service/support-service.module')
                    .then(m => m.SupportServiceModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('../../../../../com/annaniks/lift/pages/main/profile/profile.module')
                    .then(m => m.ProfileModule)
            },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(mainRoutes)],
    exports: [RouterModule]
})
export class MainRoutingModule {
    static components = [MainComponent]
}
