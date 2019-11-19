
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { PreviewRoutingModule } from './preview.routing.module';
import { PreviewService } from './preview.service';

@NgModule({
    declarations: [
        PreviewRoutingModule.components,
    ],
    imports: [
        PreviewRoutingModule,
        CommonModule,
    ],

    providers: [PreviewService]
})
export class PreviewModule { }
