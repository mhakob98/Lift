import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let postsRoutes: Routes = [
    // { path: '', component:  }
]

@NgModule({
    imports: [RouterModule.forChild(postsRoutes)],
    exports: [RouterModule]
})
export class PostsRoutingModule {
    static components = []
}