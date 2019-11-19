import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let bonusesRoutes: Routes = [
    // { path: '', component: CommonInformationView }
]

@NgModule({
    imports: [RouterModule.forChild(bonusesRoutes)],
    exports: [RouterModule]
})
export class BonusesRoutingModule {
    static components = []
}