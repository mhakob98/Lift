import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

let mainRoutes: Routes = [
    {
        path: '', component: MainComponent, children: [
            { path: '', redirectTo: '/statistics/preview', pathMatch: 'full' },
            {
                path: 'statistics',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/statistics.module')
                    .then(m => m.StatisticsModule)
            },
            {
                path: 'promotion',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/promotion/promotion.module')
                    .then(m => m.PromotionModule)
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
