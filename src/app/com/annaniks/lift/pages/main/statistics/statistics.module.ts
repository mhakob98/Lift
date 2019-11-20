
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { StatisticsRoutingModule } from './statistics.routing.module';


@NgModule({
    declarations: [
        StatisticsRoutingModule.components
    ],
    imports: [
        CommonModule,
        StatisticsRoutingModule
    ],
    exports: []
})
export class StatisticsModule {
}
