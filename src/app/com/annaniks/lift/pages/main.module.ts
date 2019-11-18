
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { MainRoutingModule } from './main.routing.module';
import { LayoutModule } from '../layout/layout-module';

@NgModule({
    declarations: [
        MainRoutingModule.components,
    ],
    imports: [
        MainRoutingModule,
        CommonModule,
        LayoutModule
    ],
    providers: [

    ],
})
export class MainModule {
}
