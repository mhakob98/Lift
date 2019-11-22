
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { SupportServiceRoutingModule } from './support-service.routing.module';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
    declarations: [
        SupportServiceRoutingModule.components,
    ],
    imports: [
        CommonModule,
        SupportServiceRoutingModule,
        SharedModule
    ],
    entryComponents: [SupportServiceRoutingModule.entryComponents],
    exports: []
})
export class SupportServiceModule {
}
