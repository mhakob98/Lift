
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { StatisticsRoutingModule } from './statistics.routing.module';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
    declarations: [
        StatisticsRoutingModule.components
    ],
    imports: [
        CommonModule,
        StatisticsRoutingModule,
        SharedModule
    ],
    exports: []
})
export class StatisticsModule {
}
