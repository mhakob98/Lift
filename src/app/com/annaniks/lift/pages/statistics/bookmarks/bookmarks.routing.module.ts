import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let bookmarksRoutes: Routes = [
    // { path: '', component: CommonInformationView }
]

@NgModule({
    imports: [RouterModule.forChild(bookmarksRoutes)],
    exports: [RouterModule]
})
export class BookmarksRoutingModule {
    static components = []
}