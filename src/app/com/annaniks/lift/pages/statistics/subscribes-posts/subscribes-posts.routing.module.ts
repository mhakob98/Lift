import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscribersPostsComponent } from './subscribes-posts.component';

let subscribesPostsRoutes: Routes = [
    { path: '', component: SubscribersPostsComponent }
]

@NgModule({
    imports: [RouterModule.forChild(subscribesPostsRoutes)],
    exports: [RouterModule]
})
export class SubscribersRoutingModule {
    static components = [SubscribersPostsComponent]
}