import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewComponent } from './preview.component';

let previewRoutes: Routes = [
    { path: '', component: PreviewComponent }
]

@NgModule({
    imports: [RouterModule.forChild(previewRoutes)],
    exports: [RouterModule]
})
export class PreviewRoutingModule {
    static components = [PreviewComponent]
}