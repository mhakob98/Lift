import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BonusesComponent } from './bonuses.component';

const bonusesRoutes: Routes = [
    { path: '', component: BonusesComponent }
]

@NgModule({
    imports: [RouterModule.forChild(bonusesRoutes)],
    exports: [RouterModule]
})
export class BonusesRoutingModule {
    static components = [BonusesComponent]
}