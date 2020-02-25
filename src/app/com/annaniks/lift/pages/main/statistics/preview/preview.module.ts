// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { PreviewRoutingModule } from './preview.routing.module';
import { PreviewService } from './preview.service';
///SlicCarouselModule
import { SlickCarouselModule } from 'ngx-slick-carousel';
//SlideToggle Module
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from '../../../../shared/shared.module';
//FormsModule
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        PreviewRoutingModule.components
    ],
    imports: [
        PreviewRoutingModule,
        CommonModule,
        SlickCarouselModule,
        MatSlideToggleModule,
        SharedModule,FormsModule,
        ReactiveFormsModule
    ],
    entryComponents:[],
    providers: [PreviewService]
})
export class PreviewModule { }
