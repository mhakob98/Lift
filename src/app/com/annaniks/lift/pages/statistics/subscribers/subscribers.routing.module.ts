import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let subscribersRoutes: Routes = [
    // { path: '', component:  }
]

@NgModule({
    imports: [RouterModule.forChild(subscribersRoutes)],
    exports: [RouterModule]
})
export class SubscribersRoutingModule {
    static components = []
}