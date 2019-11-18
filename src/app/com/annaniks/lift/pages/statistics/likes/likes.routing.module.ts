import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let likesRoutes: Routes = [
    // { path: '', component: CommonInformationView }
]

@NgModule({
    imports: [RouterModule.forChild(likesRoutes)],
    exports: [RouterModule]
})
export class LikesRoutingModule {
    static components = []
}