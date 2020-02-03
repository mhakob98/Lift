import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TariffComponent } from './tariff.component';

const tariffRoutes: Routes = [
    { path: "", component: TariffComponent }
]

@NgModule({
    imports: [RouterModule.forChild(tariffRoutes)],
    exports: [RouterModule]
})

export class TariffRoutingModule {

}