// Angular Core Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Our Components
import { SupportServiceComponent } from './support-service.component';

const supportServiceRoutes: Routes = [
    { path: '', component: SupportServiceComponent }
]

@NgModule({
    imports: [RouterModule.forChild(supportServiceRoutes)],
    exports: [RouterModule]
})
export class SupportServiceRoutingModule {
    static components = [SupportServiceComponent];
    static entryComponents = [];
}