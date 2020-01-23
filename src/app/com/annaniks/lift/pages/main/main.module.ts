
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { MainRoutingModule } from './main.routing.module';
import { LayoutModule } from '../../layout/layout-module';
import { AccountConnectionModal } from '../../core/modals';
import { SharedModule } from '../../shared/shared.module';
import { MainService } from './main.service';

@NgModule({
    declarations: [
        MainRoutingModule.components,
        AccountConnectionModal
    ],
    imports: [
        MainRoutingModule,
        SharedModule,
        CommonModule,
        LayoutModule,
    ],
    entryComponents: [
        AccountConnectionModal,
    ],
    providers: [MainService],
})
export class MainModule {
}
