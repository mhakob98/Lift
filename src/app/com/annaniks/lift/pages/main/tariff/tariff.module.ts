import { NgModule } from "@angular/core";
import { TariffComponent } from './tariff.component';
import { TariffRoutingModule } from './tariff.routing.module';
import { TariffService } from './tariff.service';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
    declarations: [TariffComponent],
    imports: [TariffRoutingModule, CommonModule,MatProgressSpinnerModule],
    providers: [TariffService]
})

export class TariffModule {}