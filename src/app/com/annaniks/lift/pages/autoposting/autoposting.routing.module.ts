import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let autopostingRoutes: Routes = [
    // { path: '', component: CommonInformationView }
]

@NgModule({
    imports: [RouterModule.forChild(autopostingRoutes)],
    exports: [RouterModule]
})
export class AutopostingRoutingModule {
    static components = [AutopostingRoutingModule]
}