import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let mySubscribersRoutes: Routes = [
    // { path: '', component:  }
]

@NgModule({
    imports: [RouterModule.forChild(mySubscribersRoutes)],
    exports: [RouterModule]
})
export class MySubscribersRoutingModule {
    static components = []
}