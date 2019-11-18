import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let commentsRoutes: Routes = [
    // { path: '', component: CommonInformationView }
]

@NgModule({
    imports: [RouterModule.forChild(commentsRoutes)],
    exports: [RouterModule]
})
export class CommentsRoutingModule {
    static components = []
}