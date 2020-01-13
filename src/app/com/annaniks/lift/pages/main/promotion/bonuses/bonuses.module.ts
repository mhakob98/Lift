
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { BonusesRoutingModule } from './bonuses.routing.module';
import { BonusesService } from './bonuses.service';

@NgModule({
    declarations: [
        BonusesRoutingModule.components,
    ],
    imports: [
        BonusesRoutingModule,
        CommonModule,
    ],
    providers: [
        BonusesService
    ]
})
export class BonusesModule {
}
