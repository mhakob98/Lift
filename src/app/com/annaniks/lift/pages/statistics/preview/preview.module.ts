
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { PreviewRoutingModule } from './preview.routing.module';

@NgModule({
    declarations: [
        PreviewRoutingModule.components
    ],
    imports: [
        PreviewRoutingModule,
        CommonModule,
    ],

    providers: []
})
export class PreviewModule { }
