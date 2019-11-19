import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const autoSubscribeRoutes: Routes = [
    // { path: '', component: CommonInformationView }
]

@NgModule({
    imports: [RouterModule.forChild(autoSubscribeRoutes)],
    exports: [RouterModule]
})
export class AutoSubscribeRoutingModule {
    static components = []
}