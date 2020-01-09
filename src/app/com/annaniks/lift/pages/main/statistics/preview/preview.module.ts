
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { PreviewRoutingModule } from './preview.routing.module';
import { PreviewService } from './preview.service';
///SlicCarouselModule
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
    declarations: [
        PreviewRoutingModule.components,
    ],
    imports: [
        PreviewRoutingModule,
        CommonModule,
        SlickCarouselModule
    ],

    providers: [PreviewService]
})
export class PreviewModule { }
