
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { MainRoutingModule } from './main.routing.module';
import { LayoutModule } from '../../layout/layout-module';
import { AcocountConnectionModal } from '../../core/modals';
import { SharedModule } from '../../shared/shared.module';
import { MainService } from './main.service';

@NgModule({
    declarations: [
        MainRoutingModule.components,
        AcocountConnectionModal
    ],
    imports: [
        MainRoutingModule,
        SharedModule,
        CommonModule,
        LayoutModule
    ],
    entryComponents:[
        AcocountConnectionModal,
    ],
    providers: [MainService],
})
export class MainModule {
}
