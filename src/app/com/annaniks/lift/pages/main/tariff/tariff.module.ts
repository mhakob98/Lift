import { NgModule } from "@angular/core";
import { TariffComponent } from './tariff.component';
import { TariffRoutingModule } from './tariff.routing.module';
import { TariffService } from './tariff.service';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [TariffComponent],
    imports: [TariffRoutingModule, CommonModule],
    providers: [TariffService]
})

export class TariffModule {}