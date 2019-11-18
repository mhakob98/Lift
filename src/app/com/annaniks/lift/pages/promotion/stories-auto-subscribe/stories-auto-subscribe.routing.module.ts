import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let storiesAutoSubscribeRoutes: Routes = [
    // { path: '', component: CommonInformationView }
]

@NgModule({
    imports: [RouterModule.forChild(storiesAutoSubscribeRoutes)],
    exports: [RouterModule]
})
export class StoriesAutoSubscribeRoutingModule {
    static components = []
}