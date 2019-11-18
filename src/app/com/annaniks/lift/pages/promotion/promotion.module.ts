
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { PromotionRoutingModule } from './promotion.routing.module';

@NgModule({
    declarations: [
        PromotionRoutingModule.components,
    ],
    imports: [
        CommonModule,
        PromotionRoutingModule
    ],
    exports: []
})
export class PromotionModule {
}
