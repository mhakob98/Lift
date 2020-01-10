
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { PreviewRoutingModule } from './preview.routing.module';
import { PreviewService } from './preview.service';
///SlicCarouselModule
import { SlickCarouselModule } from 'ngx-slick-carousel';
//SlideToggle Module
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
    declarations: [
        PreviewRoutingModule.components,
    ],
    imports: [
        PreviewRoutingModule,
        CommonModule,
        SlickCarouselModule,
        MatSlideToggleModule
    ],

    providers: [PreviewService]
})
export class PreviewModule { }
