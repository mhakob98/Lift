
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { AutopostingRoutingModule } from './autoposting.routing.module';


@NgModule({
    declarations: [
        AutopostingRoutingModule.components,
    ],
    imports: [
        CommonModule,
        AutopostingRoutingModule
    ],
    exports: []
})
export class AutopostingModule {
}
