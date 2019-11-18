import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let previewRoutes: Routes = [
    // { path: '', component:  }
]

@NgModule({
    imports: [RouterModule.forChild(previewRoutes)],
    exports: [RouterModule]
})
export class PreviewRoutingModule {
    static components = []
}