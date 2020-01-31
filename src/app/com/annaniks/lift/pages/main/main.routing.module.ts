import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const mainRoutes: Routes = [
    {
        path: '', component: MainComponent, children: [
            { path: '', redirectTo: '/statistics/preview', pathMatch: 'full' },
            {
                path: 'statistics',
                loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsModule)
            },
            {
                path: 'promotion',
                loadChildren: () => import('./promotion/promotion.module').then(m => m.PromotionModule)
            },
            {
                path: 'autoposting',
                loadChildren: () => import('./autoposting/autoposting.module').then(m => m.AutopostingModule)
            },
            {
                path: 'direct',
                loadChildren: () => import('./direct/direct.module').then(m => m.DirectModule)
            },
            {
                path: 'support-service',
                loadChildren: () => import('./support-service/support-service.module').then(m => m.SupportServiceModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
            },
            {
                path: 'direct',
                loadChildren: () => import('./direct/direct.module').then(m => m.DirectModule)
            }
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
